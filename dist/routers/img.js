"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference types="../mongodb/types/user" />
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const cwebp_1 = require("cwebp");
const config = tslib_1.__importStar(require("../utils/config"));
const router = new koa_router_1.default();
class WebPConverter {
    static convertToWebP(input, output) {
        return new Promise((resolve, reject) => {
            const encoder = cwebp_1.CWebp(input);
            encoder.write(output, err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
}
//单文件上传
router.post(['/upload', '/upload/:type'], async (ctx, next) => {
    const { type = 'img' } = ctx.params;
    const file = ctx.request.files.file; // 获取上传文件
    if (!file || !file.type.includes('image')) {
        return (ctx.body = {
            success: false,
            msg: '格式不正确',
        });
    }
    const ext = path_1.default.parse(file.name).ext;
    const appDir = path_1.default.dirname(require.main.filename);
    let name = file.name.replace(new RegExp(ext + '$'), '');
    if (type === 'avatar') {
        name = ctx.state.user.id;
    }
    const filePath = path_1.default.join(appDir, 'upload', type, name);
    // 创建可读流
    const reader = fs_1.default.createReadStream(file.path);
    // 创建可写流
    const upStream = fs_1.default.createWriteStream(filePath + ext);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    const rs = await WebPConverter.convertToWebP(file.path, filePath + '.webp');
    ctx.body = {
        data: `${config.img.host}${type}/${name}.webp`,
    };
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
//# sourceMappingURL=img.js.map