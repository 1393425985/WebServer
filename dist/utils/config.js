"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mainHost = '47.101.51.134';
exports.port = 3000;
exports.secret = 'bill';
exports.mysql = {
    database: 'database',
    username: 'root',
    password: '123456',
    port: '3306',
    host: mainHost,
};
exports.mongodb = {
    dbpath: `mongodb://web:123456@${mainHost}:27017/data`,
    username: 'web',
    password: '123456',
};
//# sourceMappingURL=config.js.map