"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_1 = tslib_1.__importDefault(require("koa"));
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const koa_static_1 = tslib_1.__importDefault(require("koa-static"));
const koa_body_1 = tslib_1.__importDefault(require("koa-body"));
const koa_views_1 = tslib_1.__importDefault(require("koa-views"));
const koa_jwt_1 = tslib_1.__importDefault(require("koa-jwt"));
const koa_compress_1 = tslib_1.__importDefault(require("koa-compress"));
const ws_1 = tslib_1.__importDefault(require("ws"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const config = tslib_1.__importStar(require("./utils/config"));
class Server {
    constructor() {
        this.app = new koa_1.default();
        this.router = new koa_router_1.default();
        this.wss = undefined;
        this.wssAliveInterval = undefined;
        this.init();
    }
    init() {
        this.initRouter();
        this.initMiddle();
        this.initEvent();
        const server = this.initListen();
        // this.initWS(server);
    }
    initRouter() {
        this.router.get('/', async (ctx) => {
            //   重定向
            //   ctx.response.redirect(url);
            await ctx.render('index', {});
        });
        this.router.get('/user', async (ctx) => {
            await ctx.render('index', {});
        });
        this.router.get('/user/:url', async (ctx) => {
            await ctx.render('index', {});
        });
        this.router.get('/main', async (ctx) => {
            await ctx.render('index', {});
        });
        this.router.get('/food', async (ctx) => {
            await ctx.render('index', {});
        });
        this.router.get('/exception/:status', async (ctx) => {
            await ctx.render('index', {});
        });
        // this.router.get('/food', async ctx => {
        //     await ctx.render('index', {});
        // });
        // this.router.get('/food', async ctx => {
        //     await ctx.render('index', {});
        // });
        const routers = fs_1.default.readdirSync(__dirname + '/routers');
        routers.forEach(element => {
            if (/\.(t|j)s$/.test(element)) {
                const module = require(__dirname +
                    '/routers/' +
                    element);
                this.router.use('/api/' + element.replace(/\.(t|j)s$/, ''), module.routes(), module.allowedMethods());
            }
        });
    }
    initMiddle() {
        // gzip
        this.app.use(koa_compress_1.default({ threshold: 2048 }));
        // logger
        this.app.use(async (ctx, next) => {
            await next();
            const rt = ctx.response.get('X-Response-Time');
            console.log(`${ctx.method} ${ctx.url} - ${rt}`);
        });
        // x-response-time
        this.app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
        });
        // token验证
        this.app.use(async (ctx, next) => {
            const token = ctx.cookies.get('token');
            // TODO 验证token 已用jwt替代
            await next();
        });
        // 加载视图
        this.app.use(koa_views_1.default(path_1.default.join(__dirname, './www'), {
            map: { html: 'ejs' },
        }));
        // error
        this.app.use(async (ctx, next) => {
            try {
                await next();
            }
            catch (err) {
                ctx.response.status = err.statusCode || err.status || 500;
                let msg = err.message;
                if (err.status === 401) {
                    msg =
                        'Protected resource, use Authorization header to get access\n';
                }
                ctx.response.body = {
                    code: -1,
                    success: false,
                    message: msg,
                };
                // 手动触发err订阅事件
                ctx.app.emit('error', err, ctx);
            }
        });
        // 格式化输出
        this.app.use(async (ctx, next) => {
            await next();
            if (ctx.type === 'application/json') {
                ctx.body = Object.assign({
                    code: 0,
                    message: '',
                    data: null,
                    success: true,
                }, (ctx.body && typeof ctx.body === 'string'
                    ? JSON.parse(ctx.body)
                    : ctx.body) || {});
            }
        });
        // 解析formdata body 上传文件
        this.app.use(koa_body_1.default({
            multipart: true,
        }));
        // jwt 解析
        this.app.use(koa_jwt_1.default({
            secret: config.secret,
        }).unless({
            path: [
                /^\/api\/user\/login/,
                /^\/api\/user\/register/,
                /^\/api\/user\/graphiql/,
                /^\/api\/user\/graphql/,
                /^((?!\/api).)*$/,
            ],
        }));
        //嵌套路由
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
        this.app.use(async (ctx, next) => {
            ctx.set('Access-Control-Allow-Origin', '*');
            ctx.set('Access-Control-Allow-Headers', '*');
            await next();
        });
        //koa静态文件中间件
        this.app.use(koa_static_1.default(path_1.default.join(__dirname, './www')));
        this.app.use(koa_static_1.default(path_1.default.join(__dirname, './static')));
        this.app.use(koa_static_1.default(path_1.default.join(__dirname, './upload')));
    }
    initEvent() {
        this.app.on('error', err => {
            console.log('logging error ', err.message);
        });
    }
    initListen() {
        console.log('Server running on port 3000');
        return this.app.listen(config.port);
    }
    initWS(server) {
        this.wss = new ws_1.default.Server({ server });
        function noop() { }
        function heartbeat() {
            this.isAlive = true;
        }
        this.wss.on('connection', ws => {
            ws.isAlive = true;
            ws.on('pong', heartbeat);
            ws.on('message', message => {
                console.log('received: %s', message);
                // wss.clients.forEach(function each(client) {
                //   if (client.readyState === WebSocket.OPEN) {
                //     client.send(data);
                //   }
                // });
            });
            ws.on('close', () => { });
            ws.send('something');
        });
        this.wssAliveInterval = setInterval(() => {
            this.wss.clients.forEach(ws => {
                if (ws.isAlive === false) {
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.ping(noop);
            });
        }, 30000);
    }
}
exports.default = new Server();
//# sourceMappingURL=server.js.map