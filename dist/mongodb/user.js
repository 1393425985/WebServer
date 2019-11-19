"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const user_1 = require("./schema/user");
const mongo_1 = tslib_1.__importDefault(require("./mongo"));
// 新增
exports.save = async (info) => mongo_1.default().then(async () => {
    const user = new user_1.User(Object.assign({ _id: new mongodb_1.ObjectID() }, info));
    const saveUser = await user.save();
    return saveUser;
});
exports.findOne = async (info) => mongo_1.default().then(async () => {
    const user = await user_1.User.findOne(info);
    return user;
});
exports.updateOne = async (id, info) => mongo_1.default().then(async () => {
    const user = await user_1.User.updateOne({ _id: id }, info);
    if (user && user.ok) {
        const newUser = await exports.findOne({ _id: id });
        return newUser;
    }
    else {
        return undefined;
    }
});
// 级联查询
// export const fetchStudentDetail = async (ctx, next) => {
//     // 利用populate来查询关联info的数据
//     const students = await Student.find({})
//         .populate({
//             path: 'info',
//             select: 'hobby height weight',
//         })
//         .exec();
//     if (students.length) {
//         ctx.body = {
//             success: true,
//             student: students,
//         };
//     } else {
//         ctx.body = {
//             success: false,
//         };
//     }
// };
//# sourceMappingURL=user.js.map