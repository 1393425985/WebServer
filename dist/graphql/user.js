"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const user_1 = require("../mongodb/schema/user");
const mongo_1 = tslib_1.__importDefault(require("../mongodb/mongo"));
let userType = new graphql_1.GraphQLObjectType({
    name: 'user',
    fields: {
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
        pwd: {
            type: graphql_1.GraphQLString,
        },
    },
});
exports.users = {
    type: new graphql_1.GraphQLList(userType),
    args: {},
    async resolve(root, params, options) {
        const a = mongo_1.default().then(async () => {
            const b = await user_1.User.find({}).exec();
            return b;
        });
        return a;
    },
};
//# sourceMappingURL=user.js.map