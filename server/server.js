// SPDX-FileCopyrightText: 2021 Amir Hossein Mafi <amir77mafi@gmail.com>
// SPDX-License-Identifier: LGPL-3.0-or-later

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const p = require('path');
const fs = require('fs/promises');
const fsc = require('fs').constants;
const logger = require('./logger');
const options = require('./options');
const graphql = require('./graphql');

(async () => {
  const args = await options();
  if (!args) return;

  const websiteDir = p.join(__dirname, '../dist');
  try {
    await fs.access(websiteDir, fsc.R_OK);
  } catch (err) {
    logger.errorE(err);
    return;
  }

  const app = express();
  app.use(express.static(websiteDir));

  const schema = await graphql(args);
  app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
  }));

  let server;

  const serverStarted = () => {
    logger.info(`gitwis running at http://localhost:${server.address().port}`);
    logger.info(`project root directory: ${p.resolve(args.path)}`);
  };

  if (args.port === 'auto') {
    let port = 8000;
    server = app.listen(port, serverStarted)
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          if (port === 65535) port = 0;
          if (port === 7999) {
            logger.error('no port found');
          } else {
            port += 1;
            server.listen(port);
          }
        } else {
          logger.errorE(err);
        }
      });
  } else {
    server = app.listen(args.port, '127.0.0.1', serverStarted)
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          logger.errorE(err, false);
        } else {
          logger.errorE(err);
        }
      });
  }
})();
