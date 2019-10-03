"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const user_1 = require("../mongodb/schema/user");
const mongo_1 = tslib_1.__importDefault(require("../mongodb/mongo"));
const fields = {
    _id: {
        type: graphql_1.GraphQLID,
    },
    name: {
        type: graphql_1.GraphQLString,
    },
    tel: {
        type: graphql_1.GraphQLString,
    },
    email: {
        type: graphql_1.GraphQLString,
    },
};
let userType = new graphql_1.GraphQLObjectType({
    name: 'user',
    fields,
});
exports.users = {
    type: new graphql_1.GraphQLList(userType),
    args: fields,
    async resolve(root, params, options) {
        return mongo_1.default().then(async () => {
            const rs = await user_1.User.find(params).exec();
            return rs;
        });
    },
};
exports.user = {
    type: userType,
    args: fields,
    async resolve(root, params, options) {
        return mongo_1.default().then(async () => {
            const rs = await user_1.User.findOne(params).exec();
            return rs;
        });
    },
};
//# sourceMappingURL=user.js.map