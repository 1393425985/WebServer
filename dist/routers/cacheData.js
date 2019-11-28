"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference types="../mongodb/types/user" />
/// <reference types="../mongodb/types/cacheData" />
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const mongodb_1 = require("mongodb");
const cacheDataControler = tslib_1.__importStar(require("../mongodb/cacheData"));
const router = new koa_router_1.default();
router.get('/get/:type', async (ctx) => {
    let { type } = ctx.params;
    const info = ctx.state.user;
    const { id } = info;
    const data = await cacheDataControler.findOne({
        creator: new mongodb_1.ObjectId(id),
        type,
    });
    ctx.body = {
        data: data ? data.toJSON() : undefined,
    };
});
router.post('/update', async (ctx) => {
    const params = ctx.request.body;
    const info = ctx.state.user;
    const { id } = info;
    const result = await cacheDataControler.updateOne({
        creator: new mongodb_1.ObjectId(id),
        type: params.type,
    }, { data: params.data });
    if (result) {
        ctx.body = {
            data: result.toJSON(),
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
// router
//     .post('/graphql', async (ctx, next) => {
//         await graphqlKoa({ schema: schema })(ctx, next); // 使用schema
//     })
//     .get('/graphql', async (ctx, next) => {
//         await graphqlKoa({ schema: schema })(ctx, next); // 使用schema
//     })
//     .get('/graphiql', async (ctx, next) => {
//         await graphiqlKoa({ endpointURL: '/api/user/graphql' })(ctx); // 重定向到graphiql路由
//     });
module.exports = router;
//# sourceMappingURL=cacheData.js.map