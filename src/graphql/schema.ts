import { GraphQLSchema, GraphQLObjectType } from 'graphql';
// 引入 type
import fs from 'fs';
import path from 'path';

const appDir = path.dirname(require.main.filename);
const graphqls = fs.readdirSync(path.join(appDir, 'graphql'));
const fields={};
graphqls.forEach(element => {
    if (!/schema\.(t|j)s$/.test(element) && /\.(t|j)s$/.test(element)) {
        const module = require(path.join(appDir, 'graphql', element));
        Object.assign(fields,module);
    }
});
// 建立 schema
export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Queries',
        fields,
    }),
});
