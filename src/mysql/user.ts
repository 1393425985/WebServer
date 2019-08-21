/// <reference types="./types/UserTypes" />
import mysql from './mysql';
import mongo from '../mongodb/mongo';

const tableName = 'user';

type FindOneRs = null | UserTypes.Model;
export const findOne = async (
  obj: Partial<UserTypes.Model>,
): Promise<FindOneRs> => {
  const keys = Object.keys(obj);
  const values = keys.map(k => obj[k]);
  if (!keys.length) {
    return null;
  }
  const rs = await mysql.query(
    `SELECT * FROM ${tableName} WHERE ${keys.map(k=>`${k}=?`).join(' AND ')}`,
    values
  );
  return rs.results[0] || null;
};

type AddOneRs = null | UserTypes.Model;
export const addOne = async (
  obj: Partial<UserTypes.Model>,
): Promise<AddOneRs> => {
  const keys = Object.keys(obj);
  const values = keys.map(k => obj[k]);
  if (!keys.length) {
    return null;
  }
  const rs = await mysql.query(
    `INSERT INTO ${tableName}(${keys.join(',')}) VALUES(${keys
      .map(() => '?')
      .join(',')})`,
    values,
  );
  if (!rs.results.insertId) {
    return null;
  }
  return findOne({ id: rs.results.insertId });
};

type UpdateOneRs = null | UserTypes.Model;
export const updateOne = async (
  updateObj: Partial<UserTypes.Model>,
  findObj: Partial<UserTypes.Model> = {},
): Promise<UpdateOneRs> => {
  const findKeys = Object.keys(findObj);
  const findValues = findKeys.map(k => findObj[k]);
  const updateKeys = Object.keys(updateObj);
  const updateValues = updateKeys.map(k => updateObj[k]);
  if (!updateKeys.length) {
    return null;
  }
  const rs = await mysql.query(
    `UPDATE ${tableName} SET ${updateKeys.map(k => `${k}=?`).join(',')} ${
      findKeys.length ? `WHERE ${findKeys.map(k => `${k}=?`).join(' AND ')}` : ''
    }`,
    [...updateValues, ...findValues],
  );
  if (!rs.results) {
    return null;
  }
  return findOne(findObj);
};
