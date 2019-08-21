"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const userModel = tslib_1.__importStar(require("../database/user"));
const config = tslib_1.__importStar(require("../utils/config"));
const router = new koa_router_1.default();
const createToken = (info) => {
    return jsonwebtoken_1.default.sign({
        nickname: info.nickname,
        id: info.id,
    }, config.secret, { expiresIn: '2h' });
};
router.post('/register', async (ctx) => {
    const params = ctx.request.body;
    if (!params.tel || !params.password) {
        return (ctx.body = {
            success: false,
            message: '参数不合法',
        });
    }
    const result = await userModel.addOne({
        tel: params.tel,
        password: params.password,
        nickname: '未命名'
    });
    if (result !== null) {
        const token = createToken(result);
        ctx.body = {
            data: { token, info: jsonwebtoken_1.default.decode(token) },
            msg: '登录成功',
        };
    }
    else {
        ctx.body = {
            success: false,
            msg: '注册失败',
        };
    }
});
router.post('/login', async (ctx) => {
    // // 设置 cookie
    // ctx.cookies.set('token', 'bill', {
    //   expires: new Date(), // 时间
    //   path: '/', // 路径
    //   domain: '0.0.0.0', // 域
    //   httpOnly: true, // 禁止js获取
    // });
    const params = ctx.request.body;
    if (!params.id || !params.password) {
        return (ctx.body = {
            success: false,
            message: '参数不合法',
        });
    }
    const result = await userModel.findOne({
        id: params.id,
        password: params.password,
    });
    if (result !== null) {
        const token = createToken(result);
        ctx.body = {
            data: { token, info: jsonwebtoken_1.default.decode(token) },
            msg: '登录成功',
        };
    }
    else {
        ctx.body = {
            success: false,
            msg: '用户名或密码错误',
        };
    }
});
// 注销
router.post('/logout', async (ctx) => {
    console.log(ctx.state.user);
    ctx.body = { OK: true };
});
// 获取信息
router.get('/userInfo', ctx => {
    const token = ctx.header.authorization;
    ctx.body = {
        data: { token: token, user: ctx.state.user },
    };
    //使用jwt-simple自行解析数据
    //  let payload = jwt.decode(token.split(' ')[1], jwtSecret);
    //   console.log(payload)
});
router.post('/update', async (ctx) => {
    const params = ctx.request.body;
    const result = await userModel.updateOne(params, { id: ctx.state.user.id });
    if (result !== null) {
        const token = createToken(result);
        ctx.body = {
            data: { token, info: jsonwebtoken_1.default.decode(token) },
            msg: '更新成功',
        };
    }
    else {
        ctx.body = {
            success: false,
            msg: '更新失败',
        };
    }
});
module.exports = router;
//# sourceMappingURL=user.js.map