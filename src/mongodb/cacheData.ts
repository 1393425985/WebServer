import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import { CacheData, CacheDataModel } from './schema/cacheData';
import connect from './mongo';

// 新增
export const save = async (
    info: Partial<CacheDataType.Model>,
): Promise<CacheDataModel> =>
    connect().then(async () => {
        const cacheData = new CacheData({ _id: new ObjectID(), ...info });
        const saveCacheData = await cacheData.save();
        return saveCacheData;
    });
export const findOne = async (
    info: Partial<CacheDataType.Model>,
): Promise<CacheDataModel> =>
    connect().then(async () => {
        const cacheData = await CacheData.findOne(info);
        return cacheData;
    });
export const updateOne = async (
    select: Pick<CacheDataType.Model, 'creator' | 'type'>,
    info: Pick<CacheDataType.Model, 'data'>,
): Promise<CacheDataModel> =>
    connect().then(async () => {
        const cacheData = await CacheData.updateOne(select, info);
        if (cacheData && cacheData.ok) {
            let newCacheData = await findOne(select);
            if (!newCacheData) {
                newCacheData = await save({ ...select, ...info });
            }
            return newCacheData;
        } else {
            return undefined;
        }
    });
