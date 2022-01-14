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

const getFilesInfo = (absFullPath, files) => {
  return Promise.all(
    files.map(async (file) => {
      const result = { name: file };

      const fileStat = await fs.stat(p.join(absFullPath, file));

      if (fileStat.isDirectory()) {
        const dirFiles = await fs.readdir(p.join(absFullPath, file));

        result.children = dirFiles;
      } else {
        result.extension = p.extname(file).slice(1);
      }

      result.size = fileStat.size;

      return result;
    })
  );
};

exports.getFiles = async function getFiles(
  { rootPath, git, isGit },
  relPath = '.'
) {
  const absFullPath = p.join(rootPath, relPath);

  if (!absFullPath.startsWith(rootPath)) {
    return new Error('invalid path');
  }

  try {
    await fs.access(absFullPath, fsc.R_OK);
  } catch {
    return new Error('invalid path');
  }

  if (!(await fs.stat(absFullPath)).isDirectory()) {
    return new Error('not a directory');
  }

  let files = await fs.readdir(absFullPath);

  if (files.length === 0) return [];

  if (isGit) {
    const ignoredFiles = await git.checkIgnore(files);
    ignoredFiles.push('.git'); // TODO: additional ignore files comes here
    // TODO: ignore .git only if it's root directory of git repo
    files = files.filter((file) => !ignoredFiles.includes(file));
  }

  const filesInfo = await getFilesInfo(absFullPath, files);

  // TODO: file hash
  return filesInfo;
};

exports.getProject = async function getProject(
  { rootPath, git, isGit },
  relPath = '/'
) {
  const absFullPath = p.join(rootPath, relPath);

  try {
    await fs.access(absFullPath, fsc.R_OK);
  } catch {
    return new Error('invalid path'); // TODO: maybe do logging here
  }

  let files = await fs.readdir(absFullPath);

  if (files.length === 0) return [];

  if (isGit) {
    const ignoredFiles = await git.checkIgnore(files);
    ignoredFiles.push('.git'); // TODO: additional ignore files comes here
    // TODO: ignore .git only if it's root directory of git repo
    files = files.filter((file) => !ignoredFiles.includes(file));
  }

  const filesInfo = await getFilesInfo(absFullPath, files);

  await Promise.all(
    filesInfo.map(async (fileInfo) => {
      if ('children' in fileInfo) {
        const subFilesInfo = await getProject(
          { rootPath, git, isGit },
          p.join(relPath, fileInfo.name)
        );

        filesInfo.push(...subFilesInfo);
      }
    })
  );

  // TODO: file hash
  return filesInfo;
};
