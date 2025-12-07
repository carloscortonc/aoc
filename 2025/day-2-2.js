// https://adventofcode.com/2025/day/2

const rawExample = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

const example = rawExample.split(/,\n?/);

const gen_full_number_2 = ({ number, groupLength, finalLength }) => {
  const iterations = finalLength / groupLength;
  let full = 0;
  for (let i = 0; i < iterations; i++) {
    full += number * 10 ** (groupLength * i);
  }
  return full;
};

const sum_range = (a, b) => ((b - a + 1) * (a + b)) / 2;

let primes = [2, 3, 5, 7, 11];
let get_factors_2 = (number) => {
  const factors = {};
  let v = number;
  let pIndex = 0;
  while (true) {
    const p = primes[pIndex];
    if (v % p !== 0 && pIndex < primes.length - 1) {
      pIndex++;
      continue;
    } else if (v % p !== 0) {
      primes.push(v);
      factors[v] = 1;
      break;
    }
    v = v / p;
    factors[p] = (factors[p] || 0) + 1;
    if (v === 1) break;
  }
  return Object.entries(factors).map((e) => [parseInt(e[0]), e[1]]);
};
const is_prime = (number) => primes.includes(number);

let compute_lenghts = (number) => {
  const factors = get_factors_2(number);
  if (factors.length == 1 && factors[0][1] === 1) return [1];
  return factors.map((f) => f[0] ** Math.max(f[1] - 1, 1)).flat();
  // return factors.map((f) => Array.from({ length: Math.max(f[1] - 1, 1) }, (_, i) => f[0] ** (i + 1))).flat();
};

/*
67594702-67751934

12.12.12

*/
const compute_range_2 = (start, end, length, ignoreEqual) => {
  const [f_start, f_end] = [start, end].map((e) => parseInt(e.slice(0, length)));
  // compute_range(start, end) = compute_range_2(start, end, start.length / 2);
  if (f_start == f_end) {
    // Check if ignoreEqual && all digits are equal
    if (
      ignoreEqual &&
      f_start
        .toString()
        .split("")
        .every((c, _, w) => c === w[0])
    ) {
      return 0;
    }
    /* const cand = gen_full_number_2({ number: f_start, groupLength: length, finalLength: start.length });
    return cand >= parseInt(start) && cand <= parseInt(end) ? cand : 0; */
    // check if the rest of groups are above(start)/below(end) the first group
    const sliceIndex = Array.from({ length: start.length / length - 1 }, (_, i) => (i + 1) * length);
    const startGroups = sliceIndex.map((i) => start.slice(i, i + length)).map((n) => parseInt(n));
    const safeStartIndex = startGroups.findIndex((g) => g < f_start);
    // Check all start-groups are above/equal f_start.  12.33.10.34
    if (startGroups.some((n, i) => n > f_start && (safeStartIndex < 0 || i < safeStartIndex))) {
      return 0;
    }
    const endGroups = sliceIndex.map((i) => end.slice(i, i + length)).map((n) => parseInt(n));
    const safeEndIndex = endGroups.findIndex((g) => g > f_start); // 11.55.55 - 11.88.00.00
    // Check all end-groups are below/equal f_start
    if (endGroups.some((n, i) => n < f_start && (safeEndIndex < 0 || i < safeEndIndex))) {
      return 0;
    }
    return gen_full_number_2({ number: f_start, groupLength: length, finalLength: start.length });
  }
  const sum = sum_range(f_start, f_end);
  let substract = 0;
  if (ignoreEqual) {
    const ignoreSections = compute_sections(start, end, 1);
    const beta = ignoreSections.reduce((acc, curr) => (acc += compute_range_2(...curr, 1, false)), 0);
    // 123.123-324.543 => 2,3
    const [startArray, endArray] = [start, end].map((e) => e.split(""));
    // Using string comparison - works the same way as with numbers for single digits
    const safeStartIndex = startArray.findIndex((e) => e < start[0]);
    const s_start = startArray.every((e, i) => e <= start[0] || (safeStartIndex >= 0 && i > safeStartIndex))
      ? parseInt(start[0])
      : parseInt(start[0]) + 1;
    const safeEndIndex = endArray.findIndex((e) => e > end[0]);
    const s_end = endArray.every((e, i) => e >= end[0] || (safeEndIndex >= 0 && i > safeEndIndex))
      ? parseInt(end[0])
      : parseInt(end[0]) - 1;
    //RECURSIVE????
    /*  const [i_start, i_end] = [start, end].map((e) => parseInt(e.slice(0, seqLength)));
    const sliceIndex = Array.from({ length: start.length / seqLength }, (_, i) => i * seqLength);
    const startGroups = sliceIndex.map((i) => start.slice(i, i + seqLength)).map((n) => parseInt(n));
    const safeStartIndex = startGroups.findIndex((g) => g < i_start);
    // Check all start-groups are above/equal f_start.  12.33.10.34
    const s_start = startGroups.some((n, i) => n > f_start && (safeStartIndex < 0 || i < safeStartIndex)) ? i_start + 1 : i_start;
    const endGroups = sliceIndex.map((i) => end.slice(i, i + seqLength)).map((n) => parseInt(n));
    const safeEndIndex = endGroups.findIndex((g) => g > f_start); // 11.55.55 - 11.88.00.00
    // Check all end-groups are below/equal f_start
    const s_end = endGroups.some((n, i) => n < i_end && (safeEndIndex < 0 || i < safeEndIndex)) ? i_end - 1 : i_end; */
    const s_sum = sum_range(s_start, s_end);
    substract = s_start <= s_end ? gen_full_number_2({ number: s_sum, groupLength: 1, finalLength: start.length }) : 0;
    console.log("[SUBSTRACT-COMP]", { substract, beta, start, end });
  }
  return gen_full_number_2({ number: sum, groupLength: length, finalLength: start.length }) - substract;
};

const compute_sections = (start, end, length) => {
  const sections = [];
  // Start section
  const startSection = [
    start,
    // MIN of [start(...), end]
    [start.slice(0, length).concat("9".repeat(Math.max(start.length - length, 0))), end].sort()[0],
  ];
  sections.push(startSection);

  // Middle section
  const middleSection = [
    (parseInt(start.slice(0, length)) + 1)
      .toString()
      .concat("0".repeat(start.length - length))
      .toString(),
    (parseInt(end.slice(0, length)) - 1)
      .toString()
      .concat("9".repeat(end.length - length))
      .padStart(end.length, "0"),
  ];
  if (parseInt(middleSection[1]) >= parseInt(middleSection[0])) {
    sections.push(middleSection);
  }

  // End section
  const endSection = [end.slice(0, length).concat("0".repeat(end.length - length)), end];
  if (parseInt(endSection[0]) > parseInt(startSection[0])) {
    sections.push(endSection);
  }
  return sections;
};

const part_1 = (i, debug = true) => {
  let count = 0;
  const candidates = i;
  for (let i = 0; i < candidates.length; i++) {
    const range = candidates[i];
    debug && console.log(range);
    let [a, b] = range.split("-");
    if (a.length < b.length) {
      // Create and add a new range to candidates
      candidates.splice(i + 1, 0, "".concat("1".concat("0".repeat(b.length - 1)), "-", b));
      // Modify current `end`
      b = "9".repeat(a.length);
    }
    if (a.length % 2 !== 0) {
      continue;
    }
    const length = a.length / 2;
    const sections = compute_sections(a, b, length);
    for (const s of sections) {
      const c = compute_range_2(...s, length, false);
      debug && console.log(`  [computing-range ] `.concat(s.join("-"), " -> ", c));
      count += c;
    }
  }
  return count;
};

const part_2 = (i, debug) => {
  let count = 0;
  const candidates = [...i];
  for (let i = 0; i < candidates.length; i++) {
    let range = candidates[i];
    let [a, b] = range.split("-"); // 998-1012 => 998-999, 1000-1012
    if (a.length < b.length) {
      // Create and add a new range to candidates
      candidates.splice(i + 1, 0, "".concat("1".concat("0".repeat(b.length - 1)), "-", b));
      // Modify current `end`
      b = "9".repeat(a.length);
      range = [a, b].join("-");
    }
    debug && console.log(range);
    if (a.length === 1) continue;
    let lengths = compute_lenghts(b.length);
    for (const l of lengths) {
      // use index to know if it is first or not => isFirst = (l == lenghts[0])
      const sections = compute_sections(a, b, l);
      for (const s of sections) {
        const c = compute_range_2(...s, l, l !== lengths[0]);
        debug && console.log(`  [computing-range L=${l}] `.concat(s.join("-"), " -> ", c));
        count += c;
      }
    }
  }
  return count;
};

const i = await fetch("https://adventofcode.com/2025/day/2/input")
  .then((r) => r.text())
  // IMPORTANT trim() to remove the last "\n" character
  .then((raw) => raw.trim().split(","));

console.log(part_2(i, true));
/* let ss = sum_range(908, 998);
console.log(ss, ss + ss * 10 ** 3); */

// 908000-998999
// 23.23.23.23 45.45.45.45
// 2323.2323

// ATTEMPS
// 54113937133 => TOO LOW
// 85387699833 => TOO LOW
// 85795366488 => WRONG
// 85591033161 => WRONG
// 85591033116 => WRONG
// 85593033114 => WRONG
// 85513235135 => YES!!
