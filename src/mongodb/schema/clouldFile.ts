import { Document, Schema, Model, model } from 'mongoose';
import * as config from '../../utils/config';
const ObjectId = Schema.Types.ObjectId;

export interface ClouldFileModel
    extends Partial<ClouldFileType.Model>,
        Document {}

export const ClouldFileSchema: Schema = new Schema({
    name: {
        type: String,
        default: '文件夹',
    },
    parentId: {
        type: String,
    },
    isFolder: {
        type: Boolean,
    },
    path: {
        type: String,
    },
    creatorId: {
        type: String,
    },
    size: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
});
ClouldFileSchema.pre<ClouldFileModel>('save', function(next) {
    if (this.isNew) {
        this.createdAt = new Date();
    }
    next();
});
ClouldFileSchema.pre<ClouldFileModel>('update', function(next) {
    this.updateAt = new Date();
    next();
});
ClouldFileSchema.pre<ClouldFileModel>('updateOne', function(next) {
    this.updateAt = new Date();
    next();
});

export const CloudFile: Model<ClouldFileModel> = model<ClouldFileModel>(
    'cloudlFile',
    ClouldFileSchema,
);
