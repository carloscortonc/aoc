// https://adventofcode.com/2025/day/7

let part_1 = (i) => {
  let count = 0;
  const m = i.map((r) => r.split(""));
  let beamPs = [m[0].findIndex((e) => e === "S")];
  for (let r = 0; r < m.length - 1; r++) {
    let nextBeamPs = new Set();
    for (let bIndex = 0; bIndex < beamPs.length; bIndex++) {
      const c = beamPs[bIndex];
      if (m[r + 1][c] === ".") {
        nextBeamPs.add(c);
        continue;
      }
      // We encounter a splitter "^"
      count++;
      if (c > 0) nextBeamPs.add(c - 1);
      if (c < m.length - 1) nextBeamPs.add(c + 1);
    }
    beamPs = [...nextBeamPs];
  }
  return count;
};

execute(async () => {
  const i = await fetch("https://adventofcode.com/2025/day/7/input")
    .then((r) => r.text())
    .then((raw) => raw.trim().split("\n"));

  console.log("Part 1: ", part_1(i));
});
