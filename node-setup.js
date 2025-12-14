const isOrigin = () => {
  const stack = new Error().stack.split("\n").slice(3)[0];
  return stack.includes(process.argv[process.argv.length - 1]);
};

globalThis.execute = (cb) => {
  if (!isOrigin()) return;
  return cb();
};
