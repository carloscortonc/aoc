// https://adventofcode.com/2025/day/6

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

let part_2 = (i) => {
  let count = 0;
  const provM = i.map((r) => r.trim().split(/\s+/));
  // Calculate the width of each column
  const columnWidth = [...Array(provM[0].length).keys()].map((cIndex) =>
    Math.max(...[...Array(provM.length).keys()].map((rIndex) => provM[rIndex][cIndex].length))
  );
  // Generate a matrix respecting the padding of each column digit
  const m = i.map(
    (r) =>
      columnWidth.reduce(
        (acc, cw) => {
          acc.v.push(r.slice(acc.c, acc.c + cw));
          acc.c += cw + 1;
          return acc;
        },
        { v: [], c: 0 }
      ).v
  );
  for (let c = 0; c < m[0].length; c++) {
    const op = m[m.length - 1][c].trim();
    let cValue = op === "+" ? 0 : 1;
    // Iterate over the digits
    for (let d = 0; d < columnWidth[c]; d++) {
      // Generate the final digit
      let n = [...Array(m.length - 1).keys()].reduce((acc, ri) => {
        const digit = m[ri][c][d];
        return acc.concat(digit !== " " ? digit : "");
      }, "");
      const v = parseInt(n);
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
  console.log("Part 2:", part_2(i));
});
