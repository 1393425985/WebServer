/// <reference types="../mongodb/types/user" />
/// <reference types="../mongodb/types/cacheData" />
import koaRouter from 'koa-router';
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa';
import { ObjectId } from 'mongodb';
import schema from '../graphql/schema';
import * as cacheDataControler from '../mongodb/cacheData';
const router = new koaRouter();

// 获取信息
type getParams = Pick<CacheDataType.Model, 'type'>;
router.get('/get/:type', async ctx => {
    let { type }: getParams = ctx.params;
    const info: UserType.Jwt = ctx.state.user;
    const { id } = info;
    const data = await cacheDataControler.findOne({
        creator: new ObjectId(id),
        type,
    });
    ctx.body = {
        data: data ? data.toJSON() : undefined,
    };
});

// 跟新
type updateParams = Pick<CacheDataType.Model, 'type' | 'data'>;
router.post('/update', async ctx => {
    const params: updateParams = ctx.request.body;
    const info: UserType.Jwt = ctx.state.user;
    const { id } = info;
    const result = await cacheDataControler.updateOne(
        {
            creator: new ObjectId(id),
            type: params.type,
        },
        { data: params.data },
    );
    if (result) {
        ctx.body = {
            data: result.toJSON(),
            msg: '更新成功',
        };
    } else {
        ctx.body = {
            success: false,
            msg: '更新失败',
        };
    }
});

router
    .post('/graphql', async (ctx, next) => {
        await graphqlKoa({ schema: schema })(ctx, next); // 使用schema
    })
    .get('/graphql', async (ctx, next) => {
        await graphqlKoa({ schema: schema })(ctx, next); // 使用schema
    })
    .get('/graphiql', async (ctx, next) => {
        await graphiqlKoa({ endpointURL: '/api/cacheData/graphql' })(ctx); // 重定向到graphiql路由
    });

module.exports = router;
