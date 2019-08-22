import { GraphQLSchema, GraphQLObjectType } from 'graphql';
// 引入 type
import * as user from './user';
// 建立 schema
export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Queries',
        fields: {
            ...user,
        },
    }),
});
