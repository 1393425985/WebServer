"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
// 引入 type
const user_1 = require("./user");
// 建立 schema
exports.default = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Queries',
        fields: {
            users: user_1.users,
        },
    }),
});
//# sourceMappingURL=schema.js.map