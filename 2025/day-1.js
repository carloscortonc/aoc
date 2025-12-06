// https://adventofcode.com/2025/day/1

const part_1 = (input) =>
  input.reduce(
    (acc, curr) => {
      if (!curr) return acc;
      const m = curr[0] === "R" ? 1 : -1;
      const value = parseInt(curr.slice(1));
      if (value === 0) return acc;
      acc.p = (100 + ((acc.p + value * m) % 100)) % 100;
      if (acc.p === 0) acc.count++;
      return acc;
    },
    { p: 50, count: 0 }
  ).count;

const part_2 = (input, debug) =>
  input.reduce(
    (acc, curr) => {
      if (!curr) return acc;
      const m = curr[0] === "R" ? 1 : -1;
      let value = parseInt(curr.slice(1));
      if (value === 0) return acc;
      let p = acc.p + value * m;
      let c = acc.count;
      if (p == 0 || (p < 0 && acc.p != 0)) acc.count++;
      if (p > 99 || p <= 0) acc.count += Math.floor((m * p) / 100);
      debug && console.log({ c: acc.p, m, value, p, incr: acc.count - c });
      acc.p = ((p % 100) + 100) % 100;
      return acc;
    },
    { p: 50, count: 0 }
  ).count;

const i = await fetch("https://adventofcode.com/2025/day/1/input")
  .then((r) => r.text())
  .then((raw) => raw.split("\n"));

console.log("Part 1: ", part_1(i));
console.log("Part 2: ", part_2(i));
