import { Document, Schema, Model, model } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

export interface CacheDataModel extends CacheDataType.Model, Document {}

export const CacheDataSchema: Schema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    creator: {
        type: ObjectId,
        required: true,
    },
});

export const CacheData: Model<CacheDataModel> = model<CacheDataModel>(
    'cacheDatas',
    CacheDataSchema,
    'cacheDatas',
);
