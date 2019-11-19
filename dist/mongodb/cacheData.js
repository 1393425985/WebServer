"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const cacheData_1 = require("./schema/cacheData");
const mongo_1 = tslib_1.__importDefault(require("./mongo"));
// 新增
exports.save = async (info) => mongo_1.default().then(async () => {
    const cacheData = new cacheData_1.CacheData(Object.assign({ _id: new mongodb_1.ObjectID() }, info));
    const saveCacheData = await cacheData.save();
    return saveCacheData;
});
exports.findOne = async (info) => mongo_1.default().then(async () => {
    const cacheData = await cacheData_1.CacheData.findOne(info);
    return cacheData;
});
exports.updateOne = async (select, info) => mongo_1.default().then(async () => {
    const cacheData = await cacheData_1.CacheData.updateOne(select, info);
    if (cacheData && cacheData.ok) {
        let newCacheData = await exports.findOne(select);
        if (!newCacheData) {
            newCacheData = await exports.save(Object.assign({}, select, info));
        }
        return newCacheData;
    }
    else {
        return undefined;
    }
});
//# sourceMappingURL=cacheData.js.map