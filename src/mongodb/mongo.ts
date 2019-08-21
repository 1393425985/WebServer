import mongoose from 'mongoose';
import * as config from '../utils/config';
// 同步引入 info model和 studen model

const connect = async()=>{
    return new Promise((resolve,reject)=>{
        mongoose.set('debug', true);
        mongoose.connect(config.mongodb.dbpath, { useNewUrlParser: true });
        mongoose.connection.on('disconnected', () => {
            reject();
        });
        mongoose.connection.on('error', err => {
            reject();
        });
        mongoose.connection.once('open', async () => {
            resolve();
        });
    });
}
export default connect;
export const connectError = '连接数据库失败';
export type IPromise<T> = Promise<{
    success: boolean;
    data: T;
    msg: string;
}>;
export const updateError = (data=null)=>({
    success: false,
    data,
    msg: '修改数据库失败'
})
export const updateSuccess = (data=null)=>({
    success: true,
    data,
    msg: '修改数据库成功'
})
export const linkError = (data=null)=>({
    success: false,
    data,
    msg: '连接数据库失败'
})
