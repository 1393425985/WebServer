import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    isOutputType,
    GraphQLInt,
} from 'graphql';
import { User } from '../mongodb/schema/user';
import connect from '../mongodb/mongo';
const fields = {
    _id: {
        type: GraphQLID,
    },
    name: {
        type: GraphQLString,
    },
    tel: {
        type: GraphQLString,
    },
    email: {
        type: GraphQLString,
    },
    // pwd: {
    //     type: GraphQLString,
    // },
}
let userType = new GraphQLObjectType({
    name: 'user',
    fields ,
});
export const users = {
    type: new GraphQLList(userType),
    args: fields,
    async resolve(root, params, options) {
        return connect().then(async () => {
            const rs = await User.find(params).exec();
            return rs;
        });
    },
};

export const user = {
    type: userType,
    args: fields,
    async resolve(root, params, options) {
        return connect().then(async () => {
            const rs = await User.findOne(params).exec();
            return rs;
        });
    },
};
