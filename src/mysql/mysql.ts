import mysql from 'mysql';
import * as config from '../utils/config';

class Mysql {
  private pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.database,
  });
  public async query(
    sql: string,
    params: any[] = [],
  ): Promise<{ results: any; fields: mysql.FieldInfo[] }> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        } else {
          conn.query(sql, params, (err, results, fields) => {
            //释放连接
            conn.release();
            if (err) {
              reject(err);
            } else {
              resolve({ results, fields });
            }
          });
        }
      });
    });
  }
}

export default new Mysql();
