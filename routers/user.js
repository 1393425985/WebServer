const koaRouter = require('koa-router');

const router = new koaRouter();

// 登录
router.post('/login', async ctx => {
  // 设置 cookie
  ctx.cookies.set('token', 'bill', {
    expires: new Date(), // 时间
    path: '/', // 路径
    domain: '0.0.0.0', // 域
    httpOnly: true, // 禁止js获取
  });
  ctx.body = { OK: true };
});

// 注销
router.post('/logout', async ctx => {
  ctx.throw(404, 'Not found');
  ctx.body = { OK: true };
});

module.exports = router;
