"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mysql_1 = tslib_1.__importDefault(require("mysql"));
const config = tslib_1.__importStar(require("../utils/config"));
class Mysql {
    constructor() {
        this.pool = mysql_1.default.createPool({
            host: config.mysql.host,
            user: config.mysql.username,
            password: config.mysql.password,
            database: config.mysql.database,
        });
    }
    async query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                }
                else {
                    conn.query(sql, params, (err, results, fields) => {
                        //释放连接
                        conn.release();
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve({ results, fields });
                        }
                    });
                }
            });
        });
    }
}
exports.default = new Mysql();
//# sourceMappingURL=mysql.js.map