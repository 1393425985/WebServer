import Koa from 'koa';
import koaRouter from 'koa-router';
import koaStatic from 'koa-static';
import koaBody from 'koa-body';
import views from 'koa-views';
import koajwt from 'koa-jwt';
import compress from 'koa-compress';
import WebSocket from 'ws';
import ejs from 'ejs';
import url from 'url';
import fs from 'fs';
import path from 'path';
import * as config from './utils/config';

class Server {
    public app = new Koa();
    public router = new koaRouter();
    public wss = undefined;
    private wssAliveInterval = undefined;
    constructor() {
        this.init();
    }
    private init() {
        this.initRouter();
        this.initMiddle();
        this.initEvent();
        const server = this.initListen();

        // this.initWS(server);
    }
    private initRouter() {
        this.router.get('/', async ctx => {
            //   重定向
            //   ctx.response.redirect(url);
            await ctx.render('index', {});
        });
        this.router.get('/user', async ctx => {
            await ctx.render('index', {});
        });
        this.router.get('/user/:url', async ctx => {
            await ctx.render('index', {});
        });
        this.router.get('/main', async ctx => {
            await ctx.render('index', {});
        });
        this.router.get('/food', async ctx => {
            await ctx.render('index', {});
        });
        this.router.get('/exception/:status', async ctx => {
            await ctx.render('index', {});
        });
        // this.router.get('/food', async ctx => {
        //     await ctx.render('index', {});
        // });
        // this.router.get('/food', async ctx => {
        //     await ctx.render('index', {});
        // });
        const routers = fs.readdirSync(__dirname + '/routers');
        routers.forEach(element => {
            if (/\.(t|j)s$/.test(element)) {
                const module: koaRouter = require(__dirname +
                    '/routers/' +
                    element);
                this.router.use(
                    '/api/' + element.replace(/\.(t|j)s$/, ''),
                    module.routes(),
                    module.allowedMethods(),
                );
            }
        });
    }
    private initMiddle() {
        // gzip
        this.app.use(compress({ threshold: 2048 }));
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
        this.app.use(
            views(path.join(__dirname, './www'), {
                map: { html: 'ejs' },
            }),
        );
        // error
        this.app.use(async (ctx, next) => {
            try {
                await next();
            } catch (err) {
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
                ctx.body = Object.assign(
                    {
                        code: 0,
                        message: '',
                        data: null,
                        success: true,
                    },
                    (ctx.body && typeof ctx.body === 'string'
                        ? JSON.parse(ctx.body)
                        : ctx.body) || {},
                );
            }
        });
        // 解析formdata body 上传文件
        this.app.use(
            koaBody({
                multipart: true, // 支持文件上传
                // encoding: 'gzip',
                // formidable: {
                //     uploadDir: path.join(__dirname, 'upload/'), // 设置文件上传目录
                //     keepExtensions: true, // 保持文件的后缀
                //     maxFieldsSize: 20 * 1024 * 1024, // 文件上传大小
                //     onFileBegin: (name, file) => {
                //         // 文件上传前的设置
                //         // console.log(`name: ${name}`);
                //         // console.log(file);
                //     },
                // },
            }),
        );
        // jwt 解析
        this.app.use(
            koajwt({
                secret: config.secret,
            }).unless({
                path: [
                    /^\/api\/user\/login/,
                    /^\/api\/user\/register/,
                    /^\/api\/user\/graphiql/,
                    /^\/api\/user\/graphql/,
                    /^((?!\/api).)*$/,
                ],
            }),
        );

        //嵌套路由
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
        this.app.use(async (ctx, next) => {
            ctx.set('Access-Control-Allow-Origin', '*');
            ctx.set('Access-Control-Allow-Headers', '*');
            await next();
        });

        //koa静态文件中间件
        this.app.use(koaStatic(path.join(__dirname, './www')));
        this.app.use(koaStatic(path.join(__dirname, './static')));
        this.app.use(koaStatic(path.join(__dirname, './upload')));

    }
    private initEvent() {
        this.app.on('error', err => {
            console.log('logging error ', err.message);
        });
    }
    private initListen() {
        console.log('Server running on port 3000');
        return this.app.listen(config.port);
    }

    private initWS(server) {
        this.wss = new WebSocket.Server({ server });
        function noop() {}

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
            ws.on('close', () => {});

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

export default new Server();
