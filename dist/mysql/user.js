"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference types="./types/UserTypes" />
const mysql_1 = tslib_1.__importDefault(require("./mysql"));
const tableName = 'user';
exports.findOne = async (obj) => {
    const keys = Object.keys(obj);
    const values = keys.map(k => obj[k]);
    if (!keys.length) {
        return null;
    }
    const rs = await mysql_1.default.query(`SELECT * FROM ${tableName} WHERE ${keys.map(k => `${k}=?`).join(' AND ')}`, values);
    return rs.results[0] || null;
};
exports.addOne = async (obj) => {
    const keys = Object.keys(obj);
    const values = keys.map(k => obj[k]);
    if (!keys.length) {
        return null;
    }
    const rs = await mysql_1.default.query(`INSERT INTO ${tableName}(${keys.join(',')}) VALUES(${keys
        .map(() => '?')
        .join(',')})`, values);
    if (!rs.results.insertId) {
        return null;
    }
    return exports.findOne({ id: rs.results.insertId });
};
exports.updateOne = async (updateObj, findObj = {}) => {
    const findKeys = Object.keys(findObj);
    const findValues = findKeys.map(k => findObj[k]);
    const updateKeys = Object.keys(updateObj);
    const updateValues = updateKeys.map(k => updateObj[k]);
    if (!updateKeys.length) {
        return null;
    }
    const rs = await mysql_1.default.query(`UPDATE ${tableName} SET ${updateKeys.map(k => `${k}=?`).join(',')} ${findKeys.length ? `WHERE ${findKeys.map(k => `${k}=?`).join(' AND ')}` : ''}`, [...updateValues, ...findValues]);
    if (!rs.results) {
        return null;
    }
    return exports.findOne(findObj);
};
//# sourceMappingURL=user.js.map