"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference types="./types/UserTypes" />
const mysql_1 = tslib_1.__importDefault(require("./mysql"));
exports.findOne = async (obj) => {
    const whereArr = Object.keys(obj).map(k => `${k}='${obj[k]}'`);
    if (!whereArr.length) {
        return null;
    }
    return mysql_1.default
        .query(`SELECT * FROM user WHERE ${whereArr.join(' AND ')}`)
        .then(rs => {
        console.log(rs);
        return null;
    });
};
//# sourceMappingURL=user.js.map