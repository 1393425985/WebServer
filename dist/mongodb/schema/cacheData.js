"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Schema.Types.ObjectId;
exports.CacheDataSchema = new mongoose_1.Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    creator: {
        type: ObjectId,
        required: true,
    },
});
exports.CacheData = mongoose_1.model('cacheDatas', exports.CacheDataSchema, 'cacheDatas');
//# sourceMappingURL=cacheData.js.map