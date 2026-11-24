// https://adventofcode.com/2025/day/12

/** Rotate a matrix represented with 1D decimal number array
 *
 * @example
 * ```javascript
 * let matrix = [7, 0, 0]
 * //   # # #
 * //   . . .
 * //   . . .
 * rotate(matrix) // => [1, 1, 1]
 * //   . . #
 * //   . . #
 * //   . . #
 * ```
 */
const rotate = (shape) => [
  (shape[2] & 4n) | ((shape[1] & 4n) >> 1n) | ((shape[0] & 4n) >> 2n),
  ((shape[2] & 2n) << 1n) | (shape[1] & 2n) | ((shape[0] & 2n) >> 1n),
  ((shape[2] & 1n) << 2n) | ((shape[1] & 1n) << 1n) | (shape[0] & 1n),
];

/** Calculate the size of a shape (1D decimal number array) */
const shape_size = (shape) => shape.reduce((acc, curr) => (acc += ((curr & 4n) >> 2n) + ((curr & 2n) >> 1n) + ((curr & 1n) >> 0n)), 0n);

/** Check if the request list of shapes is able to fit in the region's dimensions
 *  @returns {number} Number of free spaces
 */
const check_space = (quantities, max, sizeByShape) => {
  const req = quantities.reduce((acc, curr, i) => (acc += sizeByShape[i] * BigInt(curr)), 0n);
  return max - Number(req);
};

/** Assuming block shapes of NxN, check if all can be fit inside dimensions, considering filled shape (worst case) */
const check_optimistic = (quantities, dimension, shape_length) => {
  let dim_max = [...dimension];
  for (let i = 0; i < 2; i++) {
    while (dim_max[i] % shape_length !== 0) {
      dim_max[i]--;
    }
  }
  let max = dim_max[0] * dim_max[1];
  let shape_block = shape_length ** 2;
  const req = quantities.reduce((acc, curr) => (acc += BigInt(shape_block) * BigInt(curr)), 0n);
  return max >= Number(req);
};

const part_1 = (input, debug) => {
  const sections = input.split("\n\n");
  const shapes = sections.slice(0, sections.length - 1).reduce((acc, s) => {
    const [id, ...rows] = s.split("\n");
    const m = rows
      .map((r) =>
        r
          .split("")
          .map((e) => (e == "#" ? 1 : 0))
          .reduce((acc, curr, i, l) => acc + curr * 2 ** (l.length - 1 - i), 0),
      )
      .map((v) => BigInt(v));
    acc[id.slice(0, id.length - 1)] = m;
    return acc;
  }, {});
  const regions = sections[sections.length - 1]
    .split("\n")
    .filter((e) => e)
    .map((r) => {
      const [rdim, rq] = r.split(": ");
      return { dim: rdim.split("x").map((e) => parseInt(e)), q: rq.split(" ").map((e) => parseInt(e)) };
    });
  const sizeByShape = Object.entries(shapes).reduce((acc, [k, v]) => ((acc[k] = shape_size(v)), acc), {});
  let counter = 0;
  let discarded = 0;

  for (let i = 0; i < regions.length; i++) {
    const region = regions[i];
    let free = check_space(region.q, region.dim[0] * region.dim[1], sizeByShape);
    // Check if no free space remaining
    if (free <= 0) {
      discarded++;
      continue;
    }
    // Check if all shapes can be included assuming all filled
    if (check_optimistic(region.q, region.dim, shapes[0].length)) {
      counter++;
      continue;
    }

    const r = Array(region.dim[1]).fill(0n);
    const s = solve({ ...region, region: r, shapes, sizeByShape, free, lost: 0 });
    if (s) counter++;
    console.log(`[${i + 1}/${regions.length}] res=${s} counter=${counter}\n`);
  }
  debug && console.log({ discarded });
  return counter;
};

let solve = ({ region, dim, q, shapes, sizeByShape, free, lost }) => {
  const nextI = q.findIndex((e) => e);
  // Check if no shapes remaining to add
  if (nextI < 0) {
    return true;
  }
  if (lost > free) {
    return false;
  }
  const shape = shapes[nextI];
  for (let i = 0; i <= dim[1] - 3; i++) {
    for (let j = 0; j <= dim[0] - 3; j++) {
      let s = [...shape];
      const d = BigInt(dim[0] - 3 - j);
      const op = (row) => (d > 0n ? row << d : row >> d);
      // check if shape-size vs board-size
      const regionSize = s.reduce((acc, _, idx) => acc + (op(7n) & region[idx + i]), 0n);
      if (sizeByShape[nextI] > 9n - regionSize) {
        continue;
      }
      for (let rot = 0; rot < 4; rot++) {
        if (rot > 0) s = rotate(s);
        // Check if valid placement
        if (s.some((row, idx) => op(row) & region[idx + i])) {
          continue;
        }
        const nr = [...region];
        s.forEach((row, idx) => {
          nr[idx + i] = op(row) | nr[idx + i];
        });
        const nextQ = [...q];
        nextQ[nextI]--;
        //TODO calculate number of lost (orphan) spaces
        const newLost = lost;
        if (solve({ dim, q: nextQ, shapes, region: nr, free, lost, sizeByShape })) return true;
      }
    }
  }
  return false;
  // dim=[4,4]
  //
};

execute(async () => {
  const i = await fetch("https://adventofcode.com/2025/day/12/input").then((r) => r.text());
  console.log("Part 1: ", part_1(i));
});
