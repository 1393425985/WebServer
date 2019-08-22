"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const config = tslib_1.__importStar(require("../utils/config"));
// 同步引入 info model和 studen model
const connect = async () => {
    return new Promise((resolve, reject) => {
        mongoose_1.default.set('debug', true);
        mongoose_1.default.connect(config.mongodb.dbpath, { useNewUrlParser: true });
        mongoose_1.default.connection.on('disconnected', () => {
            reject();
        });
        mongoose_1.default.connection.on('error', err => {
            reject();
        });
        mongoose_1.default.connection.once('open', async () => {
            resolve();
        });
    }).then(() => { }, () => {
        console.log('连接数据库失败');
    });
};
exports.default = connect;
//# sourceMappingURL=mongo.js.map