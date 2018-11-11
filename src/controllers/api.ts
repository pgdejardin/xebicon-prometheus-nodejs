import * as Router from 'koa-router';
import logger from '../utils/logger';
import { prometheusInstance as prometheus } from '../utils/prometheus';

const router = new Router();
const helloCounter = prometheus.createCounter({ name: 'hello_counter', help: 'hello counter help' });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function hello(ctx) {
  helloCounter.inc(1);
  ctx.body = { msg: 'Hello World' };
}

async function time(ctx) {
  logger.info('calling time');
  await sleep(2000);
  ctx.body = { msg: 'I took my time' };
}

async function error(ctx) {
  logger.info('calling error');
  ctx.throw(400, 'Bad Request');
}

router.get('/hello', hello);

router.get('/time', time);

router.get('/error', error);

export default router;
