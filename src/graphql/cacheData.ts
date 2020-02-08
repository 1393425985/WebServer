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
import { CacheData } from '../mongodb/schema/cacheData';
import connect from '../mongodb/mongo';
const fields = {
    _id: {
        type: GraphQLID,
    },
    type: {
        type: GraphQLString,
    },
    creator: {
        type: GraphQLString,
    },
    
};
let cacheDataType = new GraphQLObjectType({
    name: 'cacheData',
    fields:{
        ...fields,
        data: {
            type: new GraphQLObjectType({
                name: 'cacheDataData',
                fields: {
                    project: {
                        type: new GraphQLObjectType({
                            name: 'cacheDataDataProject',
                            fields: {
                                packageCode: {
                                    type: GraphQLString,
                                },
                                svnDays: {
                                    type: GraphQLInt,
                                },
                                patchPath: {
                                    type: GraphQLString,
                                },
                            },
                        }),
                    },
                },
            }),
        },
    },
});
export const cacheDatas = {
    type: new GraphQLList(cacheDataType),
    args: fields,
    async resolve(root, params, options) {
        return connect().then(async () => {
            const rs = await CacheData.find(params).exec();
            return rs;
        });
    },
};

export const cacheData = {
    type: cacheDataType,
    args: fields,
    async resolve(root, params, options) {
        return connect().then(async () => {
            const rs = await CacheData.findOne(params).exec();
            return rs;
        });
    },
};
