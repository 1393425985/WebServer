import { Document, Schema, Model, model } from 'mongoose';
import * as config from '../../utils/config';
const ObjectId = Schema.Types.ObjectId;

export interface PageModel extends PageType.Model, Document {}

export const PageSchema: Schema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    name: String,
    icon: {
        type: String,
        default: 'desktop',
    },
    path: String,
    children: [Schema.Types.Mixed],
});

export const Page: Model<PageModel> = model<PageModel>(
    'pages',
    PageSchema,
    'pages',
);
