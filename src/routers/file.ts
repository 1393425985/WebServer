/// <reference types="../mongodb/types/user" />
import koaRouter from 'koa-router';
import path from 'path';
import fs from 'fs';
const router = new koaRouter();

// //操作日志
// router.get('/test/:type/:data', async ctx => {
//   // ctx.params获取url上的顶死的参数
//   let { type, data } = ctx.params;
//   // ctx.query获取?后的参数
//   let { username, password } = ctx.query;
//   ctx.body = { OK: true };
// });

//单文件上传
router.post('/uploadfile', async (ctx, next) => {
    const user: UserType.Jwt = ctx.state.user;
    const file = ctx.request.files.file; // 获取上传文件
    // 创建可读流
    // fs.rename(filePath, filePath, (err) => {
    //     if (err) {

    //         return;
    //     } else {
    //         // If enable webp, convert the image to webp but ignore the result.
    //         WebPConverter.convertToWebP(filePath, filePath + '.webp');
    //     }
    // });
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, 'upload', file.name);
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    return (ctx.body = '上传成功！');
});

router.post('/uploadfiles', async (ctx, next) => {
    // 上传多个文件
    // const files = ctx.request.files.file; // 获取上传文件
    // for (let file of files) {
    //   // 创建可读流
    //   const reader = fs.createReadStream(file.path);
    //   // 获取上传文件扩展名
    //   let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
    //   // 创建可写流
    //   const upStream = fs.createWriteStream(filePath);
    //   // 可读流通过管道写入可写流
    //   reader.pipe(upStream);
    // }
    return (ctx.body = '上传成功！');
});

module.exports = router;
