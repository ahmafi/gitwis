// SPDX-FileCopyrightText: 2021 Amir Hossein Mafi <amir77mafi@gmail.com>
// SPDX-License-Identifier: LGPL-3.0-or-later

const { createLogger, format, transports } = require('winston');
const { errorToObject } = require('./utils');

const { combine, colorize, align, printf } = format;

const noopFormat = format((info) => info);

const createCliFormat = (opts) =>
  combine(
    opts.color ? colorize({ all: true }) : noopFormat(),
    align(),
    printf((info) => {
      let formatWithStack = `${info.level}: ${info.message}`;
      if (info.stack) {
        formatWithStack += `\n  ${info.stack.join('\n  ')}`;
      }
      return formatWithStack;
    })
  );

const logger = createLogger({
  transports: [
    new transports.Console({ format: createCliFormat({ color: true }) }),
  ],
});

logger.changeCliFormat = (opts) => {
  logger.transports[0].format = createCliFormat(opts);
};

logger.errorE = (err, stack = true) => {
  const formattedError = errorToObject(err);
  formattedError.message = formattedError.message
    .slice(formattedError.message.indexOf(':') + 1)
    .trimStart();
  if (stack) {
    formattedError.stack = formattedError.stack
      .split('\n')
      .filter((_, index) => index !== 0)
      .map((line) => line.trim().slice(3));
  } else {
    delete formattedError.stack;
  }
  logger.error(formattedError);
};

module.exports = logger;
