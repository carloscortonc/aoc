// https://adventofcode.com/2025/day/11

const count_ways = (input, route) => {
  const m = {};
  for (const e of input) {
    const [k, ...list] = e.split(/:? /);
    m[k] = list;
  }

  let cache = {};
  let visited = new Set();
  const ways = (v, to) => {
    if (cache[v]) return cache[v];
    if (v === to) return 1;
    if (!m[v]) return 0;
    // avoid cycles
    if (visited.has(v)) return 0;
    visited.add(v);
    const r = m[v].reduce((acc, curr) => acc + ways(curr, to), 0);
    cache[v] = r;
    return r;
  };
  let counter = 1;
  for (let i = 0; i < route.length - 1; i++) {
    cache = {};
    visited.clear();
    counter *= ways(route[i], route[i + 1]);
  }
  return counter;
};

let part_1 = (i) => count_ways(i, ["you", "out"]);
let part_2 = (i) => count_ways(i, ["svr", "fft", "dac", "out"]);

execute(async () => {
  const i = await fetch("https://adventofcode.com/2025/day/11/input")
    .then((r) => r.text())
    .then((raw) => raw.split("\n"));

  console.log("Part 1: ", part_1(i));
  console.log("Part 2: ", part_2(i));
});
