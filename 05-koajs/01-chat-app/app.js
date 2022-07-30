const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  const id = Math.random();
  subscribers[id] = '';

  ctx.set('Content-Type', 'text/plain;charset=utf-8');
  ctx.set('Cache-Control', 'no-cache, must-revalidate');

  const message = await new Promise(async (resolve) => {
    const timerId = setInterval(() => {
      if (subscribers[id]) {
        resolve(subscribers[id]);
        delete subscribers[id];
        clearInterval(timerId);
      }
    }, 400);
  });

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (message) {
    Object.keys(subscribers).forEach((id) => {
      subscribers[id] = message;
    });

    ctx.body = 'Success!';
  }
});

app.use(router.routes());

module.exports = app;