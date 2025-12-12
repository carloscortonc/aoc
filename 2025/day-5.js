// https://adventofcode.com/2025/day/5

let part_1 = (i) => {
  let count = 0;
  const splitIndex = i.findIndex((e) => !e);
  const ranges = i.slice(0, splitIndex);
  const ids = i.slice(splitIndex + 1);
  for (const rawId of ids) {
    const id = parseInt(rawId);
    for (const range of ranges) {
      const [min, max] = range.split("-").map((e) => parseInt(e));
      if (id >= min && id <= max) {
        count++;
        break;
      }
    }
  }
  return count;
};

const i = await fetch("https://adventofcode.com/2025/day/5/input")
  .then((r) => r.text())
  .then((raw) => raw.trim().split("\n"));

console.log("Part 1: ", part_1(i));
