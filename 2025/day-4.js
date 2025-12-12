// https://adventofcode.com/2025/day/4

const MaxAdjacent = 3;

/** Returns the list of positions with accessible paper-rolls */
let part_1_solver = (i) => {
  const positions = [];
  const checkNeighbours = (row, col) => {
    let nc = 0;
    for (let r = Math.max(row - 1, 0); r <= Math.min(row + 1, i.length - 1); r++) {
      for (let c = Math.max(col - 1, 0); c <= Math.min(col + 1, i[0].length - 1); c++) {
        if (r === row && c === col) continue;
        if (i[r][c] == ".") continue;
        if (nc == MaxAdjacent) return false;
        nc++;
      }
    }
    return true;
  };
  for (let r = 0; r < i.length; r++) {
    const row = i[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] == ".") continue;
      if (checkNeighbours(r, c)) {
        positions.push([r, c]);
      }
    }
  }
  return positions;
};

let part_1 = (i) => part_1_solver(i).length;

let part_2 = (i_) => {
  const i = structuredClone(i_);
  let count = 0;
  while (true) {
    const positions = part_1_solver(i);
    if (positions.length === 0) break;
    for (const o of positions) {
      i[o[0]][o[1]] = ".";
    }
    count += positions.length;
  }
  return count;
};

const i = await fetch("https://adventofcode.com/2025/day/4/input")
  .then((r) => r.text())
  .then((raw) =>
    raw
      .trim()
      .split("\n")
      .map((r) => r.split(""))
  );

console.log("Part 1: ", part_1(i));
console.log("Part 2: ", part_2(i));
