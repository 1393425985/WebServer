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
    }).then(()=>{},()=>{
        console.log('连接数据库失败');
    });
}
export default connect;


