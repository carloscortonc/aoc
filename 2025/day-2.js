// https://adventofcode.com/2025/day/2

const rawExample = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

const example = rawExample.split(/,\n?/);

/**
 * @param {number} half
 * @param {number} length
 */
const gen_full_number = (half, length) => half * (10 ** length + 1);

const compute_range = (start, end) => {
  const [nStart, nEnd] = [start, end].map((e) => [
    parseInt(e.slice(0, e.length / 2)),
    parseInt(e.slice(e.length / 2)),
    e.length / 2,
  ]);
  // Case when the first halfs are equal
  if (nStart[0] == nEnd[0]) {
    return nStart[1] <= nStart[0] && nEnd[1] >= nStart[0]
      ? gen_full_number(nStart[0], nStart[2])
      : 0;
  }
  const [a, b] = [nStart, nEnd].map((e) => e[0]);
  const sum = ((b - a + 1) * (a + b)) / 2;
  return gen_full_number(sum, nStart[2]);
};

const part_1 = (i, debug) => {
  let count = 0;
  // only even numbers
  for (const range of i) {
    debug && console.log(range);
    const [a, b] = range.split("-");
    // Early return
    if (a.length == b.length && a.length % 2 !== 0) continue;

    const start = a.length % 2 !== 0 ? "1".concat("0".repeat(a.length)) : a;
    const end = b.length % 2 !== 0 ? "9".repeat(b.length - 1) : b;

    const sections = [];
    // Start section
    const startSection = [
      start,
      // MIN of [start(...), end]
      [
        start.slice(0, start.length / 2).concat("9".repeat(start.length / 2)),
        end,
      ].sort()[0],
    ];
    sections.push(startSection);

    // Middle section
    const middleSection = [
      (parseInt(start.slice(0, start.length / 2)) + 1)
        .toString()
        .concat("0".repeat(start.length / 2))
        .toString(),
      (parseInt(end.slice(0, end.length / 2)) - 1)
        .toString()
        .concat("9".repeat(end.length / 2))
        .padStart(end.length, "0"),
    ];
    if (parseInt(middleSection[1]) >= parseInt(middleSection[0])) {
      sections.push(middleSection);
    }

    // End section
    const endSection = [
      end.slice(0, end.length / 2).concat("0".repeat(end.length / 2)),
      end,
    ];
    if (parseInt(endSection[0]) > parseInt(startSection[0])) {
      sections.push(endSection);
    }
    count = sections.reduce((acc, s) => {
      const maxLength = Math.max(...s.map((e) => e.length));
      if (maxLength % 2 !== 0) return acc;
      let c = compute_range(...s.map((e) => e.padStart(maxLength, "0")));
      debug &&
        console.log("  [computing range] ".concat(s.join("-"), " -> ", c));
      return acc + c;
    }, count);
  }
  return count;
};

const i = await fetch("https://adventofcode.com/2025/day/2/input")
  .then((r) => r.text())
  // IMPORTANT trim() to remove the last "\n" character
  .then((raw) => raw.trim().split(","));

console.log(part_1(i));
