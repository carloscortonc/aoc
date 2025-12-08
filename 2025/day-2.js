// https://adventofcode.com/2025/day/2

const rawExample = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

const example = rawExample.split(/,\n?/);

/**
 * Generate a full number from the given parameters
 *
 * @example
 * ```
 * gen_full_number({ number: 23, groupLength: 2, finalLength: 4}) // 2323
 * ```
 */
const gen_full_number = ({ number, groupLength, finalLength }) => {
  const iterations = finalLength / groupLength;
  let full = 0;
  for (let i = 0; i < iterations; i++) {
    full += number * 10 ** (groupLength * i);
  }
  return full;
};

/** Calculate the sum of numbers from {a} to {b} */
const sum_range = (a, b) => ((b - a + 1) * (a + b)) / 2;

let primes = [2, 3, 5, 7, 11];
/**
 * Calculates the list of factors for a given number
 * @example
 * ```
 * get_factors(6) // [[2, 1], [3, 1]]
 * get_factors(8) // [[2, 3]]
 * ```
 */
let get_factors = (number) => {
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

/**
 * Calculates the list of possible sequence lengths for a given number of digits
 * This is based on the factors of the provided number:
 * - For prime numbers, the length will be 1
 * - For the rest, it will be the list of factors, each^{largest-power -1} (that is the largest seq for that length)
 *
 * @example
 * ```
 * compute_lenghts(5) // [1]
 * compute_lengths(6) // [2, 3]
 * compute_lengths(8) // [4]
 * ```
 */
let compute_lenghts = (number) => {
  const factors = get_factors(number);
  if (factors.length == 1 && factors[0][1] === 1) return [1];
  return factors.map((f) => f[0] ** Math.max(f[1] - 1, 1)).flat();
};

/**
 * For a given start-end range and sequence length, calculates the sum of the numbers with repeating sequence
 * If `ignoreEqual` is set to True, numbers consisting of the same digit will not be considered
 *
 * The strategy is divided into two cases:
 * - If the initial substrings of length {length} are equal for {start} and {end}, the complete number for that sequence
 *    is generated. If the generated number is contained in the sequence, the value is returned, otherwise 0 is returned
 * - If the initial substrings are not equal, the sum of all possible sequences is calculated.
 *    The sum is calculated from {start-sequence} to {end-sequence}, and this value is then transformed into the full number
 *
 * @example
 * ```
 * compute_range("11", "44", 1)
 * // is equal to the sum of
 * // 11 +
 * // 22 +
 * // 33 +
 * // 44 +
 * // => (1+2+3+4)*(1+2+3+4)*10^2
 * ```
 */
const compute_range = (start, end, length, ignoreEqual) => {
  const [s_start, s_end] = [start, end].map((e) => e.slice(0, length));
  const [f_start, f_end] = [s_start, s_end].map((e) => parseInt(e));
  if (f_start == f_end) {
    // Check if ignoreEqual && all digits are equal. 22.22.22
    if (ignoreEqual && ("" + s_start).split("").every((c) => c == start[0])) {
      return 0;
    }
    // Generate the candidate number and check if is contained within the range
    const cand = gen_full_number({ number: f_start, groupLength: length, finalLength: start.length });
    return cand >= parseInt(start) && cand <= parseInt(end) ? cand : 0;
  }
  const sum = sum_range(f_start, f_end);
  let substract = 0;
  if (ignoreEqual) {
    const ignoreSections = compute_sections(start, end, 1);
    substract = ignoreSections.reduce((acc, curr) => (acc += compute_range(...curr, 1, false)), 0);
  }
  return gen_full_number({ number: sum, groupLength: length, finalLength: start.length }) - substract;
};

/**
 * Divides a given range into at most 3:
 * - One keeping the same {start}, and {start-sequence} followed by nines (the first sequence substrings are equal)
 * - One incrementing {start-sequence} followed by 0's, and decrementing {end-sequence} followed by 9's
 * - One with {end-sequence} followed by 0's, and keeping the same {end}
 *
 * This makes the `compute_range` algorithm simpler
 *
 * @example
 * ```
 * compute_sections("23", "78", 1) // [["23", "29"], ["30", "69"], ["70", "78"]]
 * ```
 */
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

const part_1 = (i, debug) => {
  let count = 0;
  const candidates = [...i];
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
    // Because the sequence must appear twice, the length of digits must be even
    if (a.length % 2 !== 0) {
      continue;
    }
    const length = a.length / 2;
    const sections = compute_sections(a, b, length);
    for (const s of sections) {
      const c = compute_range(...s, length, false);
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
    let [a, b] = range.split("-");
    if (a.length < b.length) {
      // Create and add a new range to candidates
      candidates.splice(i + 1, 0, "".concat("1".concat("0".repeat(b.length - 1)), "-", b));
      // Modify current `end`
      b = "9".repeat(a.length);
      range = [a, b].join("-");
    }
    debug && console.log(range);
    // The sequence must be repeated at least twice, so discard single digits
    if (a.length === 1) continue;
    let lengths = compute_lenghts(b.length);
    for (const l of lengths) {
      // use index to know if it is first or not => isFirst = (l == lenghts[0])
      const sections = compute_sections(a, b, l);
      for (const s of sections) {
        const c = compute_range(...s, l, l !== lengths[0]);
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

console.log("Part 1: ", part_1(i));
console.log("Part 2: ", part_2(i));
