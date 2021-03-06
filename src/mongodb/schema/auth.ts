import { Document, Schema, Model, model } from 'mongoose';

import * as config from '../../utils/config';
const ObjectId = Schema.Types.ObjectId;

export interface AuthModel extends UserType.Model, Document {}

export const UserSchema: Schema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    userId: {
        type: String,
        default: '未命名',
    },
    email: {
        type: String,
        default: '',
    },
    tel: {
        type: String,
        default: '',
    },
    pwd: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    // info: {
    //     type: ObjectId,
    //     ref: 'Info',
    // },
});
UserSchema.pre<UserModel>('save', function(next) {
    if (this.isNew) {
        this.createdAt = new Date();
    }

    next();
});
UserSchema.methods.createToken = function() {
    return jwt.sign(
        {
            id: this.id,
            name: this.name,
            tel: this.tel,
            email: this.email,
            pwd: this.pwd,
        } as UserType.Jwt,
        config.secret,
        { expiresIn: '2h' },
    );
};
UserSchema.methods.token2info = function(token) {
    return jwt.decode(token);
};

export const User: Model<UserModel> = model<UserModel>(
    'users',
    UserSchema,
    'users',
);
