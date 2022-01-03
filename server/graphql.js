// SPDX-FileCopyrightText: 2021 Amir Hossein Mafi <amir77mafi@gmail.com>
// SPDX-License-Identifier: LGPL-3.0-or-later

const { buildSchema } = require('graphql');
const { getFiles } = require('./utils');

module.exports = async (programArgs) => {
  const schema = buildSchema(`#graphql
    type Query {
      files(path: String!): [File!]
    }
    
    type File {
      name: String!
      extension: String
      size: Int!
      isDir: Boolean!
      dirFileCount: Int
    }
    `);

  const rootValue = {
    files: async ({ path }) => {
      const files = await getFiles(programArgs, path);
      return files;
    },
  };

  return { schema, rootValue };
};
