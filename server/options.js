// SPDX-FileCopyrightText: 2021 Amir Hossein Mafi <amir77mafi@gmail.com>
// SPDX-License-Identifier: LGPL-3.0-or-later

const commander = require('commander');
const p = require('path');
const simpleGit = require('simple-git').default;
const fs = require('fs/promises');
const fsc = require('fs');
const pkgjson = require('./package.json');
const logger = require('./logger');

const validatePath = async (path) => {
  try {
    await fs.access(path, fsc.constants.R_OK);
  } catch (err) {
    let message;
    switch (err.code) {
      case 'ENOENT':
        message = 'no such directory:';
        break;
      case 'EACCES':
        message = 'permission denied:';
        break;
      default:
        message = 'unknown error while accessing:';
        break;
    }
    message += ` ${p.resolve(path)}`;
    throw new Error(message);
  }

  if (!(await fs.stat(path)).isDirectory()) {
    const message = `not a directory: ${p.resolve(path)}`;
    throw new Error(message);
  }
};

const validatePort = async (port) => {
  if (port !== 'auto') {
    const portNum = Number(port);
    if (Number.isNaN(portNum)) {
      throw new Error(`${portNum} is an invalid port number`);
    } else if (portNum < 1 || portNum >= 65535) {
      throw new Error(
        `${portNum} is in invalid range. valid range is (1-65535)`
      );
    }
  }
};

module.exports = async function resolveOptions() {
  const program = new commander.Command();
  program
    .showHelpAfterError("\nRun 'gitwis-cli --help' to see available options")
    .showSuggestionAfterError()
    .version(pkgjson.version)
    .option('--no-color', 'disable colors on console.')
    .addOption(
      new commander.Option(
        '-p --port <Port>',
        'server port. 0 takes a random port'
      )
        .env('PORT')
        .default('auto')
    )
    .addArgument(new commander.Argument('[path]').default('./'))
    .action(async (path, options) => {
      if (!options.color) {
        logger.changeCliFormat({ color: false });
      }
      await validatePath(path);
      await validatePort(options.port);
    });

  try {
    await program.parseAsync();
  } catch (err) {
    logger.errorE(err);
    return null;
  }

  const rootPath = p.resolve(program.processedArgs[0]);

  const git = simpleGit(rootPath);
  let isGit = false;
  let gitInstalled = true;
  try {
    isGit = await git.checkIsRepo();
  } catch (err) {
    logger.warn('Git is not installed, some features are disabled');
    gitInstalled = false;
  }

  if (!isGit && gitInstalled) {
    logger.warn(
      'Not a git repository (or any of the parent directories), ' +
        'some features are disabled'
    );
  }

  return {
    rootPath,
    ...program.opts(),
    isGit,
    git,
  };
};
