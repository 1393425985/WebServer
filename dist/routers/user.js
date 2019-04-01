"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const router = new koa_router_1.default();
// 登录
router.post('/login', async (ctx) => {
    // 设置 cookie
    ctx.cookies.set('token', 'bill', {
        expires: new Date(),
        path: '/',
        domain: '0.0.0.0',
        httpOnly: true,
    });
    ctx.body = { OK: true };
});
// 注销
router.post('/logout', async (ctx) => {
    ctx.throw(404, 'Not found');
    ctx.body = { OK: true };
});
module.exports = router;
//# sourceMappingURL=user.js.map