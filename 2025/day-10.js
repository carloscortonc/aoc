// https://adventofcode.com/2025/day/10

let part_1 = (i) => {
  let counter = 0;
  // Apply a given button-wiring to update the given state. Changes 1->0 and 0->1 (toggle)
  const updateState = (state, buttons) => (buttons.forEach((b) => (state[b] = 1 - state[b])), state);
  for (const machine of i) {
    const r = /\[([.#]+)\]((?: \(\d+(?:,\d+)*\))+) (\{.+\})/.exec(machine)?.slice(1);
    // Store light value as 1/0 to represent odd/even
    const lights = r[0].split("").map((e) => (e === "#" ? 1 : 0));
    const buttons = r[1]
      .trim()
      .split(" ")
      .map((e) =>
        e
          .slice(1, e.length - 1)
          .split(",")
          .map((e) => parseInt(e))
      )
      .map((e, i) => [i, e]);

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

execute(async () => {
  const i = await fetch("https://adventofcode.com/2025/day/10/input")
    .then((r) => r.text())
    .then((raw) => raw.trim().split("\n"));

  console.log("Part 1: ", part_1(i));
});
