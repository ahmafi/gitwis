// SPDX-FileCopyrightText: 2021 Amir Hossein Mafi <amir77mafi@gmail.com>
// SPDX-License-Identifier: LGPL-3.0-or-later

const p = require('path');
const fs = require('fs/promises');
const fsc = require('fs').constants;

exports.errorToObject = (err) => {
  const obj = {};
  Object.getOwnPropertyNames(err).forEach((key) => {
    obj[key] = err[key];
  });
  return obj;
};

exports.getFiles = async function getFiles(
  { path, git, isGit },
  relPath = '.',
) {
  const fullPath = p.join(path, relPath);

  if (!fullPath.startsWith(path)) {
    return new Error('invalid path');
  }

  try {
    await fs.access(fullPath, fsc.R_OK);
  } catch {
    return new Error('invalid path');
  }

  if (!(await fs.stat(fullPath)).isDirectory()) {
    return new Error('not a directory');
  }

  let files = await fs.readdir(fullPath);

  if (files.length === 0) return [];

  if (isGit) {
    const ignoredFiles = await git.checkIgnore(files);
    ignoredFiles.push('.git'); // TODO: additional ignore files comes here
    // TODO: ignore .git only if it's root directory of git repo
    files = files.filter((file) => !ignoredFiles.includes(file));
  }

  const filesInfo = await Promise.all(
    files.map(async (file) => {
      const result = {
        name: file,
        extension: p.extname(file),
      };

      const fileStat = await fs.stat(p.join(fullPath, file));

      if (fileStat.isDirectory()) {
        const fileCount = (await fs.readdir(
          p.join(fullPath, file),
        )).length;

        result.isDir = true;
        result.dirFileCount = fileCount;
      } else {
        result.isDir = false;
      }

      result.size = fileStat.size;

      return result;
    }),
  );

  // TODO: file hash
  return filesInfo;
};
