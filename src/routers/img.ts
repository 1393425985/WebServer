/// <reference types="../mongodb/types/user" />
import koaRouter from 'koa-router';
import path from 'path';
import fs from 'fs';
import { CWebp, DWebp }  from 'cwebp';
import * as config from '../utils/config';



const router = new koaRouter();

class WebPConverter {
    static convertToWebP(input, output) {
        return new Promise((resolve, reject) => {
            const encoder = CWebp(input);
            encoder.write(output, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

//单文件上传
router.post(['/upload','/upload/:type'], async (ctx, next) => {
    const { type = 'img' } = ctx.params;
    
    const file = ctx.request.files.file; // 获取上传文件
    if (!file || !file.type.includes('image')) {
        return (ctx.body = {
            success: false,
            msg: '格式不正确',
        });
    }
    const ext = path.parse(file.name).ext;
    const appDir = path.dirname(require.main.filename);
    
    let name = file.name.replace(new RegExp(ext+'$'),'');
    if(type === 'avatar'){
        name = ctx.state.user.id;
    }
    const filePath = path.join(appDir, 'upload', type, name);

    // 创建可读流
    const reader = fs.createReadStream(file.path);
    // 创建可写流
    const upStream = fs.createWriteStream(filePath+ext);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    const rs = await WebPConverter.convertToWebP(file.path, filePath+'.webp');
    ctx.body = {
        data: `${config.img.host}${type}/${name}.webp`,
    }
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
