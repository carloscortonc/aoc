// https://adventofcode.com/2025/day/3

const part_1 = (i, debug) => {
  let count = 0;
  const logs = [];
  for (const bank of i) {
    logs.push(bank);
    const ratings = bank.split("");
    let c = ratings.slice(0, 2);
    let prevC = ""; // for debugging purposes
    for (let i = 1; i < ratings.length; i++) {
      prevC.toString() !== c.toString() && logs.push("   [current candidate] ".concat(c.join("")));
      prevC = [...c];
      // Early return if we already found the largest possible (99)
      if (c.join("") == "99") break;
      if (i < ratings.length - 1 && ratings[i] > c[0]) {
        c = ratings.slice(i, i + 2);
      } else if (ratings[i] > c[1]) {
        c[1] = ratings[i];
      }
    }
    count += parseInt(c.join(""));
  }
  debug && console.log(logs.join("\n"));
  return count;
};

const part_2 = (i, debug) => {
  let count = 0;
  const logs = [];
  const maxLength = 12;
  for (const bank of i) {
    logs.push(bank);
    const ratings = bank.split("");
    let c = ratings.slice(0, maxLength);
    let prevC = ""; // for debugging purposes
    let skipped = 0;
    for (let i = 1; i < ratings.length; i++) {
      prevC.toString() !== c.toString() && logs.push("   [current candidate] ".concat(c.join(""), ", i=", i));
      prevC = [...c];
      const rating = ratings[i];
      const startIndex = Math.max(maxLength - ratings.length + i, 0);
      // Early return if we already found the largest possible
      if (c.join("") === "9".repeat(maxLength)) break;
      for (let d = startIndex; d < maxLength && skipped + maxLength < ratings.length && skipped + d < i; d++) {
        if (rating > c[d]) {
          c = c.slice(0, d).concat(ratings.slice(i, i + maxLength - d));
          skipped = i - d;
          break;
        }
      }
    }
    count += parseInt(c.join(""));
  }
  debug && console.log(logs.join("\n"));
  return count;
};

const i = await fetch("https://adventofcode.com/2025/day/3/input")
  .then((r) => r.text())
  .then((raw) => raw.trim().split("\n"));

console.log("Part 1: ", part_1(i));
console.log("Part 1: ", part_2(i));
