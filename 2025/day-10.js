// https://adventofcode.com/2025/day/10

const parseMachine = (m) => {
  const raw = /\[([.#]+)\]((?: \(\d+(?:,\d+)*\))+) \{([\d,]+)\}/.exec(m)?.slice(1);
  const buttons = raw[1]
    .trim()
    .split(" ")
    .map((e) =>
      e
        .slice(1, e.length - 1)
        .split(",")
        .map((e) => parseInt(e))
    )
    .map((e, i) => [i, e]);
  return { buttons, raw };
};

let part_1 = (i) => {
  let counter = 0;
  // Apply a given button-wiring to update the given state. Changes 1->0 and 0->1 (toggle)
  const updateState = (state, buttons) => (buttons.forEach((b) => (state[b] = 1 - state[b])), state);
  for (const machine of i) {
    const { buttons, raw } = parseMachine(machine);
    // Store light value as 1/0 to represent odd/even
    const lights = raw[0].split("").map((e) => (e === "#" ? 1 : 0));

    /** Execute breadth-first-search by iterating over the light indexes that need
     * to be changed, and finding the available candidates (buttons) that were not already used
     */

    /** @type {{ state: number[]; value: number[]}[]} */
    const branches = [{ state: Array(lights.length).fill(0), value: [] }];
    outer: while (branches.length) {
      // Get and remove current branch
      const [branch] = branches.splice(i, 1);
      const nextLightIndex = branch.state.findIndex((v, i) => v !== lights[i]);
      const candidates = buttons.filter((b) => !branch.value.includes(b[0]) && b[1].includes(nextLightIndex));
      if (candidates.length == 0) {
        continue;
      }
      for (const [cIndex, c] of candidates) {
        const value = branch.value.concat(cIndex);
        const nextState = updateState(branch.state.slice(0), c);
        if (nextState.toString() === lights.toString()) {
          counter += value.length;
          break outer;
        }
        branches.push({ state: nextState, value });
      }
    }
  }
  return counter;
};

const generatePermutations = ({ count, options, result = [], partial = [] }) => {
  if (options.length === 1) {
    result.push(partial.concat([[count, options[0]]]));
    return result;
  }
  for (let i = count; i >= 0; i--) {
    const p = partial.concat(i > 0 ? [[i, options[0]]] : []);
    if (count === i) {
      result.push(p);
    } else {
      generatePermutations({ count: count - i, options: options.slice(1), result, partial: p });
    }
  }
  return result;
};

const _mfact = { 1: 1 };
const factorial = (n) => {
  if (_mfact[n]) return _mfact[n];
  _mfact[n] = n * factorial(n - 1);
  return _mfact[n];
};

const getCombinations = (total, groupSize) => {
  if (groupSize == 1) return 1;
  if (total == 1) return groupSize;
  const n = total + groupSize - 1;
  const k = groupSize - 1;
  return factorial(n) / (factorial(k) * factorial(n - k));
};

let part_2 = (i, debug) => {
  let counter = 0;
  let tbranches = 0;
  // Apply a given button-wiring to update the given state. Changes 1->0 and 0->1 (toggle)
  const updateState = (state, buttons, incr = 1) => (buttons.forEach((b) => (state[b] += incr)), state);
  for (let mi = 0; mi < i.length; mi++) {
    const machine = i[mi];
    const { buttons, raw } = parseMachine(machine);
    debug && console.log(`[processing machine ${mi + 1}/${i.length}] {${raw[2]}}`);
    const target = raw[2].split(",").map((e) => parseInt(e));
    const buttonsByP = target.reduce((acc, _, i) => ((acc[i] = buttons.filter((b) => b[1].includes(i)).map((b) => b[0])), acc), {});

    let totalBranches = 1;
    let min = undefined;
    let minCounter = undefined;
    /** @type {{ state: number[]; counter: number; bByP: { [p: string]: number[] }}[]} */
    const branches = [{ state: Array(target.length).fill(0), counter: 0, bByP: buttonsByP }];
    outer: while (branches.length) {
      // Get and remove next branch
      const [branch] = branches.splice(i, 1);
      if (min && branch.counter > minCounter) {
        // continue outer;
        break outer;
      }
      const nextTargetIndex = Object.entries(branch.bByP).reduce(
        (acc, [i, bList]) => (
          // (acc.temp = getCombinations(target[i] - branch.state[i], bList.length)),
          (acc.temp = bList.length),
          // (acc.temp = target[i] - branch.state[i]),
          //
          acc.temp < acc.min ? ((acc.min = acc.temp), (acc.v = i)) : {},
          acc
        ),
        { min: Infinity, v: undefined }
      ).v;
      const bOptions = branch.bByP[nextTargetIndex];
      const diff = target[nextTargetIndex] - branch.state[nextTargetIndex];
      // Generate the exiting permutations for splitting `diff` into `bOptions`
      const permutations = generatePermutations({ count: diff, options: bOptions });
      for (const p of permutations) {
        const bcounter = branch.counter + diff;
        const nextState = p.reduce((acc, curr) => updateState(acc, buttons[curr[1]][1], curr[0]), branch.state.slice(0));
        // Check if final state reached
        if (nextState.toString() === target.toString()) {
          // min = Math.min(min, bcounter);
          min = Math.min(min || Infinity, bcounter);
          minCounter = Math.min(minCounter || Infinity, branch.counter);
          break;
          /* counter += bcounter;
          debug && console.log("  Count:", bcounter);
          debug && console.log("  Total branches:", totalBranches);
          // continue outer;
          break outer; */
        }
        // Check if state is valid
        if (nextState.some((v, i) => v > target[i])) continue;
        const completedTIndexes = nextState
          .map((s, i) => [i, s])
          .filter((e) => e[1] === target[e[0]])
          .map((e) => e[0]);
        const bToOmit = buttons.filter((b) => b[1].some((v) => completedTIndexes.includes(v))).map((e) => e[0]);
        const newBByP = Object.entries(branch.bByP).reduce(
          (acc, [i, bList]) => ((acc[i] = bList.filter((c) => !bToOmit.includes(c))), !acc[i].length ? delete acc[i] : {}, acc),
          {}
        );
        // Check if no options available for any remaining target value
        if (nextState.some((v, i) => v < target[i] && !newBByP[i]?.length)) continue;
        // if (!Object.keys(newBByP).length) continue;
        // Insert at the end, for BFS
        branches.push({ state: nextState, counter: bcounter, bByP: newBByP });
        totalBranches++;
        // Insert at the beggining, for DFS
        // branches.splice(0, 0, { state: nextState, counter, bByP: newBByP });
      }
    }
    counter += min;
    debug && console.log("  Count:", min);
    debug && console.log("  Visited branches:", totalBranches);
    tbranches += totalBranches;
  }

  console.log({ tbranches });
  return counter;
};

execute(async () => {
  const i = await fetch("http://localhost:8080/2025/day-10-input.txt" /* "https://adventofcode.com/2025/day/10/input" */)
    .then((r) => r.text())
    .then((raw) => raw.trim().split("\n"));

  console.log("Part 1: ", part_1(i));
  console.log("Part 2: ", part_2(i));
});
