// https://adventofcode.com/2025/day/3

const solver = ({ i, nDigits, debug }) => {
  let count = 0;
  const logs = [];
  for (const bank of i) {
    logs.push(bank);
    const ratings = bank.split("");
    let c = ratings.slice(0, nDigits);
    let prevC = ""; // for debugging purposes
    let skipped = 0; // keep track of how many ratings we have skipped when generating a new candidate
    for (let i = 1; i < ratings.length; i++) {
      prevC.toString() !== c.toString() && logs.push("   [current candidate] ".concat(c.join("")));
      prevC = [...c];
      const rating = ratings[i];
      // The start index to search on depends on how many ratings are left after the last candidate digit
      const startIndex = Math.max(nDigits - ratings.length + i, 0);
      // Early return if we already found the largest possible
      if (c.join("") === "9".repeat(nDigits)) break;
      for (let d = startIndex; d < nDigits && skipped + nDigits < ratings.length && skipped + d < i; d++) {
        if (rating > c[d]) {
          c = c.slice(0, d).concat(ratings.slice(i, i + nDigits - d));
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

const part_1 = (i) => solver({ i, nDigits: 2 });
const part_2 = (i) => solver({ i, nDigits: 12 });

execute(async () => {
  const i = await fetch("https://adventofcode.com/2025/day/3/input")
    .then((r) => r.text())
    .then((raw) => raw.trim().split("\n"));

  console.log("Part 1: ", part_1(i));
  console.log("Part 2: ", part_2(i));
});
