"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const graphql_server_koa_1 = require("graphql-server-koa");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const schema_1 = tslib_1.__importDefault(require("../graphql/schema"));
const userControler = tslib_1.__importStar(require("../mongodb/user"));
const router = new koa_router_1.default();
router.post('/register', async (ctx) => {
    const params = ctx.request.body;
    if (!(params.tel || params.email) || !params.pwd) {
        return (ctx.body = {
            success: false,
            message: '参数不合法',
        });
    }
    const result = await userControler.save(Object.assign({
        pwd: params.pwd,
    }, params.tel ? { tel: params.tel } : { email: params.email }));
    if (result) {
        const token = result.createToken();
        ctx.body = {
            data: { token, info: result.token2info(token) },
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
    let params = ctx.request.body;
    if (params.token || ((params.tel || params.email) && params.pwd)) {
    }
    else {
        return (ctx.body = {
            success: false,
            message: '参数不合法',
        });
    }
    if (params.token) {
        const info = jsonwebtoken_1.default.decode(params.token);
        params.tel = info.tel;
        params.pwd = info.pwd;
    }
    const result = await userControler.findOne(Object.assign({
        pwd: params.pwd,
    }, params.tel ? { tel: params.tel } : { email: params.email }));
    if (result) {
        const token = result.createToken();
        ctx.body = {
            data: { token, info: result.token2info(token) },
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
    const result = await userControler.updateOne(ctx.state.user.id, params);
    if (result) {
        const token = result.createToken();
        ctx.body = {
            data: { token, info: result.token2info(token) },
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
router
    .post('/graphql', async (ctx, next) => {
    await graphql_server_koa_1.graphqlKoa({ schema: schema_1.default })(ctx, next); // 使用schema
})
    .get('/graphql', async (ctx, next) => {
    await graphql_server_koa_1.graphqlKoa({ schema: schema_1.default })(ctx, next); // 使用schema
})
    .get('/graphiql', async (ctx, next) => {
    await graphql_server_koa_1.graphiqlKoa({ endpointURL: '/api/user/graphql' })(ctx); // 重定向到graphiql路由
});
module.exports = router;
//# sourceMappingURL=user.js.map