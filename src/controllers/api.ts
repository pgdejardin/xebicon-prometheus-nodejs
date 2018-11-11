import * as Router from 'koa-router';
import logger from '../utils/logger';

const router = new Router();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function hello(ctx) {
  logger.info('calling hello');
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
