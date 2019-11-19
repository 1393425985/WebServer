import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import { User, UserModel } from './schema/user';
import connect from './mongo';

// 新增
export const save = async (info: Partial<UserType.Model>): Promise<UserModel> =>
    connect().then(async () => {
        const user = new User({ _id: new ObjectID(), ...info });
        const saveUser = await user.save();
        return saveUser;
    });
export const findOne = async (
    info: Partial<UserType.Model>,
): Promise<UserModel> =>
    connect().then(async () => {
        const user = await User.findOne(info);
        return user;
    });
export const updateOne = async (
    id: string,
    info: Partial<UserType.Model>,
): Promise<UserModel> =>
    connect().then(async () => {
        const user = await User.updateOne({ _id: id }, info);
        if (user && user.ok) {
            const newUser = await findOne({ _id: id });
            return newUser;
        } else {
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
