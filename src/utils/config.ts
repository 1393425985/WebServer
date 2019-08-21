const mainHost = '47.101.51.134';
export const port = 3000;
export const secret = 'bill';
export const mysql = {
  database: 'database',
  username: 'root',
  password: '123456',
  port: '3306',
  host: mainHost,
};
export const mongodb = {
  dbpath: `mongodb://web:123456@${mainHost}:27017/data`,
  username: 'web',
  password: '123456',
}