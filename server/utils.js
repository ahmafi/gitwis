exports.errorToObject = (err) => {
  const obj = {};
  Object.getOwnPropertyNames(err).forEach((key) => {
    obj[key] = err[key];
  });
  return obj;
};
