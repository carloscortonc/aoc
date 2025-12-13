const file = Symbol("file");
globalThis[file] = process.argv[process.argv.length - 1];

const isOrigin = () => {
  const stack = new Error().stack.split("\n").slice(3)[0];
  return stack.includes(globalThis[file]);
};

globalThis.execute = (cb) => {
  if (!isOrigin()) return;
  return cb();
};
