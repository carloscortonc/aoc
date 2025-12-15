// https://adventofcode.com/2025/day/7

let solver = (i) => {
  let count = 0;
  const m = i.map((r) => r.split(""));
  const startIndex = m[0].findIndex((e) => e === "S");
  // Use object to track how many beans land on each position. Beam indexes are still `Object.keys(beamPsObj)`
  let beamPsObj = { [startIndex]: 1 };
  for (let r = 0; r < m.length - 1; r++) {
    let nextBeamPsObj = {};
    const beamPs = Object.keys(beamPsObj).map((e) => parseInt(e));
    for (let bIndex = 0; bIndex < beamPs.length; bIndex++) {
      const c = beamPs[bIndex];
      const add = (e) => (nextBeamPsObj[e] = (nextBeamPsObj[e] || 0) + beamPsObj[c]);
      if (m[r + 1][c] === ".") {
        add(c);
        continue;
      }
      // We encounter a splitter "^"
      count++;
      if (c > 0) add(c - 1);
      if (c < m[0].length - 1) add(c + 1);
    }
    beamPsObj = { ...nextBeamPsObj };
  }
  const timelines = Object.values(beamPsObj).reduce((acc, curr) => acc + curr, 0);
  return { count, timelines };
};

let part_1 = (i) => solver(i).count;
let part_2 = (i) => solver(i).timelines;

execute(async () => {
  const i = await fetch("https://adventofcode.com/2025/day/7/input")
    .then((r) => r.text())
    .then((raw) => raw.trim().split("\n"));

  console.log("Part 1: ", part_1(i));
  console.log("Part 2: ", part_2(i));
});
