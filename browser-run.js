const baseUrl = "https://raw.githubusercontent.com/carloscortonc/aoc/refs/heads/main";
// const baseUrl = "http://localhost:8080";

const run = (year, day) => {
  const fetchFile = (f) => fetch(f).then((r) => r.text());
  const createBlob = (c) => URL.createObjectURL(new Blob([c], { type: "application/javascript" }));
  const sourceFile = `${baseUrl}/${year}/day-${day}.js`;
  (async () => {
    const source = await fetchFile(sourceFile).then((r) => r.split("\n"));
    // Find and handle imports
    for (let i = 0; i < source.length; i++) {
      const r = /^import .* from "(.+)";?/.exec(source[i]);
      if (!r) continue;
      const location = new URL(r[1], sourceFile).href;
      let temp = "let execute=()=>{}\n".concat(await fetchFile(location));
      source.splice(i, 1, source[i].replace(r[1], createBlob(temp)));
    }
    await import(createBlob("let execute = (cb) => cb();\n".concat(source.join("\n"))));
  })();
};
