"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_1 = tslib_1.__importDefault(require("koa"));
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const koa_static_1 = tslib_1.__importDefault(require("koa-static"));
const koa_body_1 = tslib_1.__importDefault(require("koa-body"));
const koa_views_1 = tslib_1.__importDefault(require("koa-views"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const app = new koa_1.default();
// 路由集合
const router = new koa_router_1.default();
router.get('/', async (ctx) => {
    //   重定向
    //   ctx.response.redirect(url);
    await ctx.render('index', { token: 'aaa' });
});
const routers = fs_1.default.readdirSync(__dirname + '/routers');
routers.forEach(element => {
    if (/\.(t|j)s$/.test(element)) {
        const module = require(__dirname + '/routers/' + element);
        router.use('/api/' + element.replace(/\.(t|j)s$/, ''), module.routes(), module.allowedMethods());
    }
});
// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});
// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});
// token验证
app.use(async (ctx, next) => {
    const token = ctx.cookies.get('token');
    // TODO 验证token
    await next();
});
// 加载视图
app.use(koa_views_1.default(path_1.default.join(__dirname, './www'), {
    map: { html: 'ejs' },
}));
// error
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message,
        };
        // 手动触发err订阅事件
        ctx.app.emit('error', err, ctx);
    }
});
// 格式化输出
app.use(async (ctx, next) => {
    await next();
    if (ctx.type === 'application/json') {
        if (ctx.body) {
            ctx.body = {
                code: 0,
                message: 'success',
                data: ctx.body,
            };
        }
        else {
            ctx.body = {
                code: 0,
                message: 'success',
            };
        }
    }
});
// 解析formdata body 上传文件
app.use(koa_body_1.default({
    multipart: true,
    encoding: 'gzip',
    formidable: {
        uploadDir: path_1.default.join(__dirname, 'upload/'),
        keepExtensions: true,
        maxFieldsSize: 2 * 1024 * 1024,
        onFileBegin: (name, file) => {
            // 文件上传前的设置
            // console.log(`name: ${name}`);
            // console.log(file);
        },
    },
}));
//嵌套路由
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', '*');
    await next();
});
//koa静态文件中间件
app.use(koa_static_1.default(path_1.default.join(__dirname, './static')));
app.on('error', function (err) {
    console.log('logging error ', err.message);
});
app.listen(3000);
console.log('Server running on port 3000');
//# sourceMappingURL=server.js.map