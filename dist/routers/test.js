"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const router = new koa_router_1.default();
//操作日志
router.get('/test/:type/:data', async (ctx) => {
    // ctx.params获取url上的顶死的参数
    let { type, data } = ctx.params;
    // ctx.query获取?后的参数
    let { username, password } = ctx.query;
    ctx.body = { OK: true };
});
//获取餐厅
router.post('/test/:page/:size', async (ctx) => {
    //获取post body上的参数
    console.log(this.request.body); // if buffer or text
    console.log(this.request.files); // if multipart or urlencoded
    console.log(this.request.fields); // if json
    // -------------------------------------------------------------------------
    let { page, size } = ctx.params;
    ctx.body = { OK: true };
});
module.exports = router;
//# sourceMappingURL=test.js.map