import { Document, Schema, Model, model } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

export interface CacheDataModel extends CacheDataType.Model, Document {}
const ProjectSchema: Schema = new Schema({
    packageCode: String,
    svnDays: Number,
    patchPath: String,
    list: [
        new Schema({
            name: String,
            type: String,
            path: String,
            port: String,
            scripts: new Schema({
                npm: String,
                cmd: String,
            }),
        }),
    ],
});
export const CacheDataSchema: Schema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    data: new Schema({
        project: ProjectSchema,
    }),
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
