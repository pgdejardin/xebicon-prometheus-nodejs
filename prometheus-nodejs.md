theme: XebiCon18
slidenumbers: true

![](https://xebicon.fr/wp-content/uploads/2018/06/Xebicon18-brongniart-tech4exec.jpg)

## XebiCon'__18__

## How to monitor a __Node.js__ app inside a __container__

---

# Who am I?

![left filtered](pg.jpg)

Paul-Guillaume Déjardin

**@pgdejardin**

Back-end / Front-end developer

---

# Agenda

![right 50%](https://cdn3.iconfinder.com/data/icons/seo-glyph-2/24/task-512.png)

- Monitoring?
- **Prometheus** & Co.
- Some code
- Demonstration

---

# What is Monitoring?

^
exemple de projet IRSN ou on gérer a la main sur l'ESX les applis tomcat, etc.
L'efficacité de processus
Les indicateurs business
L’état de santé des services
Alerting
Auto-remediation

---

![inline fill](monitoring.png)

^
- Point de vue de l'Ops
Utilisation CPU
Utilisation de la RAM
Espace disque 
Bande passante du réseau
Température du matériel
Taux d'erreur disque
- Point de vue de l'app (dev + business)
Connections simultanées
Métriques métier
Débit de réception des messages

---

![inline](https://raw.githubusercontent.com/xebia-france/logarcade/master/assets/logos/prometheus.png)

---

![inline](prometheus.png)

---

![10%](https://risingstack-blog.s3.amazonaws.com/2016/Jun/Node_js_logo_svg-1466683930347.png)
![45%](https://www.cncf.io/wp-content/uploads/2017/08/logo_prometheus_padding-300x277.png)
![35%](https://1000logos.net/wp-content/uploads/2017/07/Logo-Docker.jpg)

# Let's see what we have

- Node.js server made with Koa and TypeScript running in Docker
- with a `/api/hello` route
- based on `prometheus-node-client` using `prom-client`
- *Prometheus* server 
- *Grafana* server
- *cAdvisor* server

---

# prometheus.ts

[.code-highlight: none]
[.code-highlight: 1]
[.code-highlight: 3]

```typescript
import PrometheusClient from 'prometheus-nodejs-client';

export default new PrometheusClient('myApplication');
```

---

# index.ts

[.code-highlight: none]
[.code-highlight: 1-3]
[.code-highlight: 5-7]
[.code-highlight: 9-13]
[.code-highlight: 15-17]

```typescript
import * as Koa from 'koa';
import * as Router from 'koa-router';
import prometheus from '../utils/prometheus';

const app = new Koa();
const router = new Router();
const prometheusRouter = new Router();

prometheusRouter.get('/metrics', async ctx => {
  ctx.body = prometheus.getMetrics();
});

router.use('/api', api.routes());

app
  .use(prometheusRouter.routes())
  .use(router.routes())
```

---

# api.ts

[.code-highlight: none]
[.code-highlight: 1]
[.code-highlight: 3-5]
[.code-highlight: 7-10]

```typescript
import prometheus from '../utils/prometheus';

const helloCounter = prometheus.createCounter(
    { name: 'hello_counter', help: 'hello counter help' }
);

async function hello(ctx) {
  helloCounter.inc(1);
  ctx.body = { msg: 'Hello World' };
}
```

---

![right 50%](https://twhyderabad.github.io/xtremetesting/static/media/performance-testing.5b7a5cb2.png)

# Demo

---

# Take Away

![](https://www.mediaan.com/wp-content/uploads/2017/01/launch17.jpg)

- https://github.com/pgdejardin/xebicon-prometheus-nodejs
- https://github.com/pgdejardin/prometheus-client-node
- https://prometheus.io/
- https://grafana.com/
- https://github.com/google/cadvisor
- https://prometheus.io/docs/guides/cadvisor/

