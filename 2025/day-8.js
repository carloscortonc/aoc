// https://adventofcode.com/2025/day/8

const distance = (a, b) => Math.sqrt([0, 1, 2].map((i) => (a[i] - b[i]) ** 2).reduce((acc, curr) => acc + curr, 0));

let part_1 = (i) => {
  const m = i.map((i) => i.split(",").map((e) => parseInt(e)));
  const distances = {};
  // Pre-compute all distances
  for (let r = 0; r < m.length - 1; r++) {
    for (let nr = r + 1; nr < m.length; nr++) {
      distances[`${r}-${nr}`] = distance(m[r], m[nr]);
    }
  }
  // Sort distances
  const sorted = Object.entries(distances).sort((a, b) => a[1] - b[1]);
  const circuits = [];
  // Keep track of which circuit index uses each entry-index
  const circuitIndexById = {};
  for (const [entry] of sorted.slice(0, 1000)) {
    const [a, b] = entry.split("-");
    // Find the correct circuit index to add it to
    const circuitIndex = circuitIndexById[a] ?? circuitIndexById[b] ?? circuits.length;
    // Check if two circuits need to be joined
    if (circuitIndexById[a] >= 0 && circuitIndexById[b] >= 0 && circuitIndexById[b] !== circuitIndex) {
      const toDeleteIndex = circuitIndexById[b];
      for (const e of circuits[toDeleteIndex]) {
        circuits[circuitIndexById[a]].push(e);
        circuitIndexById[e] = circuitIndexById[a];
      }
      // Empty `b` index
      circuits[toDeleteIndex] = [];
      continue;
    }
    if (!circuits[circuitIndex]) {
      circuits[circuitIndex] = [];
    }
    for (const e of [a, b]) {
      if (circuits[circuitIndex].includes(e)) continue;
      circuits[circuitIndex].push(e);
      circuitIndexById[e] = circuitIndex;
    }
  }
  return circuits
    .map((c) => c.length)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, curr) => acc * curr, 1);
};

execute(async () => {
  const i = await fetch("https://adventofcode.com/2025/day/8/input")
    .then((r) => r.text())
    .then((raw) => raw.trim().split("\n"));

  console.log("Part 1: ", part_1(i));
});
