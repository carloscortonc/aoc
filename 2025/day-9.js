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

const Direction = {
  Right: 0,
  Down: 1,
  Left: 2,
  Up: 3,
};

/** Map of transitions, where the key is a given direction from point a to b, and the value is
 * the expected position for [clockwise, counterclockwise]
 *
 * This can be visualized with a simple square:
 *
 * ####
 * #··#
 * ####
 *
 * With points A(0,0), B(4,0), C(4,4) and D(0,4), if the points are provided clockwise [A,B,C,D],
 * the directions are Right(A->B), Down(B->C) and Left(C->D).
 * We can add 1 to a counter if a transition matches the expected clockwise direction, and subtracting 1 otherwise.
 * For the example: +1(Right->Down) +1(Down->Left) => +2, that is, clockwise
 *
 * If the points were [D,C,B,A], the directions would be Right(D-C), Up(C->B), Left(B->A), and
 * the counter: -1(Right->Up) -1(Up->Left) => -2, that is, counterclockwise
 *
 * This will allow us to know, for a given segment, where the inside/outside of the shape is.
 * With [A,B,C,D], we can know in AB that inside is down, because transitions[AB=Left]=Down
 */

const transitions = {
  [Direction.Right]: [Direction.Down, Direction.Up],
  [Direction.Down]: [Direction.Left, Direction.Right],
  [Direction.Left]: [Direction.Up, Direction.Down],
  [Direction.Up]: [Direction.Right, Direction.Left],
};

const inRange = (n, a, b) => n >= a && n <= b;
const inInnerRange = (n, a, b) => n > a && n < b;

let part_2 = (i) => {
  const list = i.map((p) => p.split(",").map((e) => parseInt(e)));
  let maxArea = 0;

  const maps = { x: {}, y: {} };
  let count = 0,
    dir = undefined;
  /** Perform initial processing:
   * - group points by x and y coordinates
   * - calculate the direction of the polygon (count > 0 => clockwise, count < 0 => counterclockwise)
   */
  for (let i = 0; i < list.length; i++) {
    let nextDir;
    let section, target, value;
    let next = (i + 1) % list.length;
    // Check if `x` value is the same
    if (list[i][0] == list[next][0]) {
      section = "x";
      target = list[i][0];
      value = [list[i][1], list[next][1]];
      nextDir = value[0] > value[1] ? Direction.Up : Direction.Down;
    } else {
      section = "y";
      target = list[i][1];
      value = [list[i][0], list[next][0]];
      nextDir = value[0] > value[1] ? Direction.Left : Direction.Right;
    }
    if (dir) {
      count += nextDir === transitions[dir][0] ? 1 : -1;
    }
    dir = nextDir;
    maps[section][target] ||= [];
    maps[section][target].push(...value);
  }

  const checkDiagonal = ([a, ai], [b, bi]) => {
    const ignored = [a, b].map((e) => e.toString());
    // Points corresponding to the oher diagonal
    const otherDiagonal = [
      [a[0], b[1]],
      [b[0], a[1]],
    ].map((e) => [e, e.toString()]);
    // Sort x and y from smaller to largest
    const sorted = [
      [a[0], b[0]],
      [a[1], b[1]],
    ].map((e) => e.sort((a, b) => a - b));

    // Get the list of points contained within the target rectangle
    const pInRange = list.reduce(
      (acc, curr) => {
        if (ignored.includes(curr.toString())) return acc;
        if (inRange(curr[0], ...sorted[0])) acc.x.push(curr);
        if (inRange(curr[1], ...sorted[1])) acc.y.push(curr);
        return acc;
      },
      { x: [], y: [] }
    );
    for (const o of pInRange.x) {
      /** If the point belongs to the other diagonal, check if the other one on the same diagonal is inside of the shape or not.
       * For this, the overall idea is, considering A,B,O:
       * - Caculate OB direction, which will be used to know were the inside of the shape is.
       * - Calculate O[other-diagonal] direction on the other axis as the previous.
       * - Check if both direction matches, otherwise the provided points are not valid (rectangle is outside of the shape)
       *
       * Example with A(9,7), B(2,5), O(9,5), assuming clockwise:
       * - OB direction is Left (x axis) => the inside of the shape is UP
       * - The other diagonal is (2,7), and the direction from O (y axis) is Down
       * - The two previous directions do not match, so the rectangle lies outside, and points are not valid
       */
      if (otherDiagonal.some((od) => od[1] === o.toString())) {
        const oppositePoint = otherDiagonal.find((od) => od[1] !== o.toString())[0];
        const bPoint = bi == ai + 2 ? b : a;
        // Find accesor-index of diff (x=0, y=1)
        const bIndex = bPoint[0] == o[0] ? 1 : 0;
        const findDirection = (index, p1, p2) =>
          [
            [Direction.Right, Direction.Left],
            [Direction.Down, Direction.Up],
          ][index][p1[index] > p2[index] ? 1 : 0];
        const bDir = findDirection(bIndex, o, bPoint);
        const diagonalDir = findDirection(1 - bIndex, o, oppositePoint);
        const expectedDiagonalDir = transitions[bDir][count > 0 ? 0 : 1];
        if (diagonalDir !== expectedDiagonalDir) return false;
        continue;
      }
      const iindex = i.indexOf(o.join(","));
      const prev = list[(iindex - 1 + i.length) % i.length];
      const next = list[(iindex + 1) % i.length];
      // Find prev/next that changes y-value
      let p = prev[1] == o[1] ? next : prev;
      // Ignore it if is joined to one of the provided points (a/b), it will be checked in the other axis
      if (ignored.includes(p.toString())) continue;
      // Check if o[1] is inside y-range
      if (inInnerRange(o[1], ...sorted[1])) return false;
      let ySorted = [o[1], p[1]].sort((a, b) => a - b);
      if (ySorted[0] <= sorted[1][0] && ySorted[1] >= sorted[1][1]) return false;
    }
    for (const o of pInRange.y) {
      // Ignore as it was already processed on x-rango loop
      if (otherDiagonal.some((od) => od[1] === o.toString())) continue;
      const iindex = i.indexOf(o.join(","));
      const prev = list[(iindex - 1 + i.length) % i.length];
      const next = list[(iindex + 1) % i.length];
      // Find prev/next that changes x-value
      let p = prev[0] == o[0] ? next : prev;
      // Ignore it if is joined to one of the provided points (a/b), it will be checked in the other axis
      if (ignored.includes(p.toString())) continue;
      // Check if o[0] is inside x-range
      if (inInnerRange(o[0], ...sorted[0])) return false;
      let xSorted = [o[0], p[0]].sort((a, b) => a - b);
      if (xSorted[0] <= sorted[0][0] && xSorted[1] >= sorted[0][1]) return false;
    }
    return true;
  };
  for (let i = 0; i < list.length - 1; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const [a, b] = [list[i], list[j]];
      let c = area(a, b);
      if (c < maxArea) continue;
      if (!checkDiagonal([a, i], [b, j])) continue;
      maxArea = c;
    }
  }
  return maxArea;
};

execute(async () => {
  const i = await fetch("https://adventofcode.com/2025/day/9/input")
    .then((r) => r.text())
    .then((raw) => raw.trim().split("\n"));

  console.log("Part 1: ", part_1(i));
  console.log("Part 2: ", part_2(i));
});
