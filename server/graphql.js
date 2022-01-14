// SPDX-FileCopyrightText: 2021 Amir Hossein Mafi <amir77mafi@gmail.com>
// SPDX-License-Identifier: LGPL-3.0-or-later

const p = require('path');
const { getFiles, getProject } = require('./utils');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { makeExecutableSchema } = require('@graphql-tools/schema');

module.exports = async (programArgs) => {
  const typeDefs = loadSchemaSync(p.join(__dirname, 'schema.gql'), {
    loaders: [new GraphQLFileLoader()],
  });

  const resolvers = {
    Query: {
      files: async (obj, { path }) => {
        const files = await getFiles(programArgs, path);
        return files;
      },
      project: async (obj, { path }) => {
        const project = await getProject(programArgs, path);
        return project;
      },
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
