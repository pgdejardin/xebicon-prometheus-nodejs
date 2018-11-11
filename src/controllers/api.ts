import * as Router from 'koa-router';

const router = new Router();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function hello(ctx) {
  ctx.body = { msg: 'Hello World' };
}

async function time(ctx) {
  await sleep(2000);
  ctx.body = { msg: 'I took my time' };
}

async function error(ctx) {
  ctx.throw(400, 'Bad Request');
}

router.get('/hello', hello);

router.get('/time', time);

router.get('/error', error);

export default router;
