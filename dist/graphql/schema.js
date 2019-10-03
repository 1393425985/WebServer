"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
// 引入 type
const user = tslib_1.__importStar(require("./user"));
// 建立 schema
exports.default = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Queries',
        fields: Object.assign({}, user),
    }),
});
//# sourceMappingURL=schema.js.map