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

const getFilesInfo = (path, files) => {
  return Promise.all(
    files.map(async (file) => {
      const result = { name: file };

      const fileStat = await fs.stat(p.join(path, file));

      if (fileStat.isDirectory()) {
        // const children = await fs.readdir(p.join(parentPath, file));
        result.size = 0;
      } else {
        result.size = fileStat.size;
      }

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

const getDir = async (path, git, isGit) => {
  try {
    await fs.access(path, fsc.R_OK);
  } catch {
    return new Error('invalid path'); // TODO: maybe do logging here
  }

  let files = await fs.readdir(path);

  if (files.length === 0) return [];

  if (isGit) {
    const ignoredFiles = await git.checkIgnore(files);
    ignoredFiles.push('.git'); // TODO: additional ignore files comes here
    // TODO: ignore .git only if it's root directory of git repo
    files = files.filter((file) => !ignoredFiles.includes(file));
  }

  const filesObj = {};
  files.forEach((file) => (filesObj[file] = {}));

  return filesObj;
};

exports.getTree = async function getTree({ rootPath, git, isGit }) {
  const tree = {
    children: await getDir(rootPath, git, isGit),
    size: 0,
  };

  const stack = [[tree, undefined, rootPath, false]];

  while (stack.length) {
    const [object, parent, parentPath, visited] = stack.pop();

    if (!visited && object.children) {
      stack.push([object, parent, parentPath, true]);

      await Promise.all(
        Object.entries(object.children).map(async ([name, child]) => {
          const childPath = p.join(parentPath, name);
          const childStat = await fs.stat(childPath); // FIXME error handling
          if (childStat.isDirectory()) {
            child.size = 0; // Ignore the directory size (usually a static size like 4096)
            // child.size = childStat.size; // Use this to add up directory sizes as well

            child.children = await getDir(childPath, git, isGit);
          } else {
            child.size = childStat.size;
          }

          stack.push([child, object, childPath]);
        })
      );
    } else if (parent) {
      parent.size += object.size;
    }
  }

  return tree;
};
