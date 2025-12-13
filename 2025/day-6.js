// https://adventofcode.com/2025/day/5

let part_1 = (i) => {
  let count = 0;
  const m = i.map((row, index) => {
    const s = row.trim().split(/\s+/);
    return index < i.length - 1 ? s.map((e) => parseInt(e)) : s;
  });
  for (let c = 0; c < m[0].length; c++) {
    const op = m[m.length - 1][c];
    let cValue = op === "+" ? 0 : 1;
    for (let r = 0; r < m.length - 1; r++) {
      const v = m[r][c];
      if (op == "+") {
        cValue += v;
      } else {
        cValue *= v;
      }
    }
    count += cValue;
  }
  return count;
};

execute(async () => {
  const i = await fetch("https://adventofcode.com/2025/day/6/input")
    .then((r) => r.text())
    .then((raw) => raw.trim().split("\n"));

  console.log("Part 1:", part_1(i));
});
