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

const i = await fetch("https://adventofcode.com/2025/day/3/input")
  .then((r) => r.text())
  .then((raw) => raw.trim().split("\n"));

// MAX = 200*99 = 19800
console.log("Part 1: ", part_1(i));
