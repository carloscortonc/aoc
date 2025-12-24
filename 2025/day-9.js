// https://adventofcode.com/2025/day/9

/** Calculate the area between diagonal points `a` and `b` */
const area = (a, b) =>
  [
    [a[0], b[0]],
    [a[1], b[1]],
  ]
    .map((e) => e.sort((a, b) => b - a))
    .reduce((acc, curr) => acc * (curr[0] - curr[1] + 1), 1);

let part_1 = (i) => {
  const list = i.map((p) => p.split(",").map((e) => parseInt(e)));
  let maxArea = 0;
  for (let i = 0; i < list.length - 1; i++) {
    for (let j = i + 1; j < list.length; j++) {
      let a = area(list[i], list[j]);
      if (a > maxArea) {
        maxArea = a;
      }
    }
  }
  return maxArea;
};

execute(async () => {
  const i = await fetch("https://adventofcode.com/2025/day/9/input")
    .then((r) => r.text())
    .then((raw) => raw.split("\n"));

  console.log("Part 1: ", part_1(i));
});
