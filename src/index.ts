import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as morgan from 'koa-morgan';
import * as Router from 'koa-router';

import api from './controllers/api';
import logger, { appStarted } from './utils/logger';
import { prometheusInstance as prometheus } from './utils/prometheus';

const app = new Koa();
const router = new Router();
const prometheusRouter = new Router();

const httpRequestDurationMicroseconds = prometheus.createHistogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500],  // buckets for response time from 0.1ms to 500ms
});

app
    .use(bodyParser())
    .use(async (ctx, next) => {
      const responseTimeInMs = Date.now();
      try {
        await next();
        httpRequestDurationMicroseconds
            .labels(ctx.method, ctx.request.path, ctx.status.toString())
            .observe(Date.now() - responseTimeInMs);
      } catch (e) {
        httpRequestDurationMicroseconds
            .labels(ctx.method, ctx.request.path, e.status)
            .observe(Date.now() - responseTimeInMs);
        logger.error(e);
        ctx.throw(e.status);
      }
    })
    .use(morgan('dev'));

// Prometheus endpoint
prometheusRouter.get('/metrics', async (ctx) => {
  ctx.body = prometheus.getMetrics();
});

router.use('/api', api.routes());

app
    .use(prometheusRouter.routes())
    .use(prometheusRouter.allowedMethods())
    .use(router.routes())
    .use(router.allowedMethods());

const port = process.env.PORT || 8080;
const prettyHost: string = process.env.HOST || 'localhost';

// Start your app.
const server = app.listen(port, () => {
  // Connect to ngrok in dev mode
  appStarted(port, prettyHost);
});

process.on('SIGTERM', () => {
  clearInterval(prometheus.getMetricsInterval());

  server.close((err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    process.exit(0);
  });
});
