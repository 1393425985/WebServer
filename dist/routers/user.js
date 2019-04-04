"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const userModel = tslib_1.__importStar(require("../database/user"));
const config = tslib_1.__importStar(require("../utils/config"));
const router = new koa_router_1.default();
// 注册
router.post('/register', async (ctx) => {
    userModel.findOne({
        id: 1,
        password: '',
    });
    ctx.body = { OK: true };
});
router.post('/login', async (ctx) => {
    // // 设置 cookie
    // ctx.cookies.set('token', 'bill', {
    //   expires: new Date(), // 时间
    //   path: '/', // 路径
    //   domain: '0.0.0.0', // 域
    //   httpOnly: true, // 禁止js获取
    // });
    const data = ctx.request.body;
    if (!data.id || !data.password) {
        return (ctx.body = {
            code: 1,
            success: false,
            message: '参数不合法',
        });
    }
    const result = await userModel.findOne({
        id: data.id,
        password: data.password,
    });
    if (result !== null) {
        const token = jsonwebtoken_1.default.sign({
            nickname: result.nickname,
            id: result.id,
        }, config.secret, { expiresIn: '2h' });
        ctx.body = {
            data: { token, info: jsonwebtoken_1.default.decode(token) },
            msg: '登录成功',
        };
    }
    else {
        ctx.body = {
            code: 1,
            success: false,
            msg: '用户名或密码错误',
        };
    }
});
// 注销
router.post('/logout', async (ctx) => {
    ctx.body = { OK: true };
});
router.get('/userInfo', ctx => {
    const token = ctx.header.authorization;
    ctx.body = {
        data: { token: token, user: ctx.state.user },
    };
    //使用jwt-simple自行解析数据
    //  let payload = jwt.decode(token.split(' ')[1], jwtSecret);
    //   console.log(payload)
});
module.exports = router;
//# sourceMappingURL=user.js.map