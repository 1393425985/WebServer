"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Schema.Types.ObjectId;
exports.ClouldFileSchema = new mongoose_1.Schema({
    name: {
        type: String,
        default: '文件夹',
    },
    parentId: {
        type: String,
    },
    isFolder: {
        type: Boolean,
    },
    path: {
        type: String,
    },
    creatorId: {
        type: String,
    },
    size: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.ClouldFileSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = new Date();
    }
    next();
});
exports.ClouldFileSchema.pre('update', function (next) {
    this.updateAt = new Date();
    next();
});
exports.ClouldFileSchema.pre('updateOne', function (next) {
    this.updateAt = new Date();
    next();
});
exports.CloudFile = mongoose_1.model('cloudlFile', exports.ClouldFileSchema);
//# sourceMappingURL=clouldFile.js.map