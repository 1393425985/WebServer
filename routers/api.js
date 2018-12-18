const koaRouter = require('koa-router');

const router = new koaRouter();

//操作日志
router.get('/test/:type/:data', async ctx => {
  // ctx.params获取url上的顶死的参数
  let { type, data } = ctx.params;
  // ctx.query获取?后的参数
  let { username, password } = ctx.query;
  ctx.body = { OK: true };
});

//获取餐厅
router.post('/test/:page/:size', async ctx => {
  //获取post body上的参数
  console.log(this.request.body); // if buffer or text
  console.log(this.request.files); // if multipart or urlencoded
  console.log(this.request.fields); // if json
  // -------------------------------------------------------------------------
  let { page, size } = ctx.params;
  ctx.body = data;
});

module.exports = router;
