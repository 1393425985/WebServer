"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const config = tslib_1.__importStar(require("../../utils/config"));
const ObjectId = mongoose_1.Schema.Types.ObjectId;
exports.UserSchema = new mongoose_1.Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    name: {
        type: String,
        default: '未命名',
    },
    email: {
        type: String,
        default: '',
    },
    tel: {
        type: String,
        default: '',
    },
    pwd: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.UserSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = new Date();
    }
    next();
});
exports.UserSchema.methods.createToken = function () {
    return jsonwebtoken_1.default.sign({
        id: this.id,
        name: this.name,
        tel: this.tel,
        email: this.email,
        pwd: this.pwd,
    }, config.secret, { expiresIn: '2h' });
};
exports.UserSchema.methods.token2info = function (token) {
    return jsonwebtoken_1.default.decode(token);
};
exports.User = mongoose_1.model('users', exports.UserSchema, 'users');
//# sourceMappingURL=user.js.map