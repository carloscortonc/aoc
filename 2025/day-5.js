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

let part_2 = (i) => {
  const sliceIndex = i.findIndex((e) => !e);
  // Sort the list of ranges by start-value
  const ranges = i.slice(0, sliceIndex).sort((a, b) => {
    const p = [a, b].map((e) => e.split("-"));
    const sdiff = p[0][0] - p[1][0];
    return sdiff === 0 ? p[0][1] - p[1][1] : sdiff;
  });
  const parseRange = (r) => r.split("-").map((e) => parseInt(e));
  for (let ri = 0; ri < ranges.length - 1; ri++) {
    const [curr, next] = [ri, ri + 1].map((index) => parseRange(ranges[index]));
    // Check to dismiss next range (contained inside first)
    if (curr[1] >= next[1]) {
      ranges.splice(ri + 1, 1);
      ri--;
    }
    // Check to concatenate both ranges
    else if (curr[1] >= next[0]) {
      ranges[ri] = "".concat(curr[0], "-", next[1]);
      ranges.splice(ri + 1, 1);
      ri--;
    }
  }
  return ranges.reduce((acc, curr) => {
    const s = curr.split("-").map((e) => parseInt(e));
    return acc + s[1] - s[0] + 1;
  }, 0);
};

const i = await fetch("https://adventofcode.com/2025/day/5/input")
  .then((r) => r.text())
  .then((raw) => raw.trim().split("\n"));

console.log("Part 1: ", part_1(i));
console.log("Part 2: ", part_2(i));
