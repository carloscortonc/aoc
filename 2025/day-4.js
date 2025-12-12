// https://adventofcode.com/2025/day/4

const MaxAdjacent = 3;

let part_1 = (ri) => {
  const i = ri.map((r) => r.split(""));
  let count = 0;
  const checkNeighbours = (row, col) => {
    let nc = 0;
    for (let r = Math.max(row - 1, 0); r <= Math.min(row + 1, i.length - 1); r++) {
      for (let c = Math.max(col - 1, 0); c <= Math.min(col + 1, i[0].length - 1); c++) {
        if (r === row && c === col) continue;
        if (i[r][c] == ".") continue;
        if (nc == MaxAdjacent) return 0;
        nc++;
      }
    }
    return 1;
  };
  for (let r = 0; r < i.length; r++) {
    const row = i[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] == ".") continue;
      count += checkNeighbours(r, c);
    }
  }
  return count;
};

const i = await fetch("https://adventofcode.com/2025/day/4/input")
  .then((r) => r.text())
  .then((raw) => raw.trim().split("\n"));

console.log("Part 1: ", part_1(i));
