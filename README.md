# Advent of Code Solutions

https://adventofcode.com/

## Executing a solution

Each solution file makes a request to aoc for the puzzle input. The puzzle input varies from one user to the other, that is why you need to be authenticated on the page when requesting the input.

- By executing the code from the browser's devtools console (while being authenticated in aoc), the input can be correctly requested
- When executing locally (with nodejs), you would need to first download the input into a file and read it from fs (or declare it on a variable inside the script).

In case a given script needs to import anything from another script, a method `execute` is used to wrap the solution execution.
This way, importing from another file will not make the other script execute its solution. This is both implemented for browser execution and node, described below.

### Execute solution on AoC site (browser console)

To execute a given solution on AoC site, open devtools and paste the code in [`browser-run.js`](./browser-run.js).
Once that is done, you can execute a given puzzle with:

```js
run(year, day); // e.g. run(2025, 1)
```

This will load and execute the solution files from this repository, hosted on Github. To execute on local files (once the repository is cloned), you can:

- Start a web server on the root of the repo
- Update [`baseUrl`](./browser-run.js#L1) value to point to the local web server

```sh
$ cd aoc
$ npx http-server . --cors --port=8080
```

### Execute solution locally with node

To execute a solution in your machine, use the following:

```sh
$ cd aoc
$ node -r ./node-setup.js ./{year}/day-{day}.js
```
