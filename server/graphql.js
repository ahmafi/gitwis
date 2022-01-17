// SPDX-FileCopyrightText: 2021 Amir Hossein Mafi <amir77mafi@gmail.com>
// SPDX-License-Identifier: LGPL-3.0-or-later

const p = require('path');
const { getFiles, getTree } = require('./utils');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

module.exports = async (programArgs) => {
  const typeDefs = loadSchemaSync(p.join(__dirname, 'schema.gql'), {
    loaders: [new GraphQLFileLoader()],
  });

  const resolvers = {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    Query: {
      files: async (obj, { path }) => {
        const files = await getFiles(programArgs, path);
        return files;
      },
      tree: async () => await getTree(programArgs),
    },

    FileAndDir: {
      __resolveType(obj) {
        if ('children' in obj) return 'Directory';
        else return 'File';
      },
    },
  };

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
};
