import mongoose from 'mongoose';
import { User, UserModel } from './schema/user';
import connect, {
    updateError,
    updateSuccess,
    linkError,
    IPromise,
} from './mongo';;

// 新增
export const save = async (
    info: Partial<UserType.Model>,
): IPromise<UserModel> =>
    new Promise((resolve, reject) => {
        connect().then(
            async () => {
                const user = new User(info);
                const saveUser = await user.save();
                if (saveUser) {
                    resolve(updateSuccess(saveUser));
                } else {
                    reject(updateError());
                }
            },
            () => {
                reject(linkError());
            },
        );
    });
    export const findOne = async (
        info: any,
    ): IPromise<UserModel> =>
        new Promise((resolve, reject) => {
            connect().then(
                async () => {
                    const user = await User.findOne(info);
                    if (user) {
                        resolve(updateSuccess(user));
                    } else {
                        reject(updateError());
                    }
                },
                () => {
                    reject(linkError());
                },
            );
        });
export const updateOne = async (
    id: string,
    info: Partial<UserType.Model>,
): IPromise<UserModel> =>
    new Promise((resolve, reject) => {
        connect().then(
            async () => {
                const user = await User.updateOne({_id:id}, info);
                if (user && user.ok) {
                    const newUser = await findOne({_id:id})
                    resolve(updateSuccess(newUser.data));
                } else {
                    reject(updateError());
                }
            },
            () => {
                reject(linkError());
            },
        );
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
