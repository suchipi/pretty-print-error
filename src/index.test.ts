import { test, expect } from "vitest";
import { visualizeAnsiCodes, defaultCodes } from "visualize-ansi-codes";
import { formatError } from "./index";

function clean(str) {
  return visualizeAnsiCodes(
    str.replace(new RegExp(process.cwd(), "g"), "<cwd>"),
    {
      ...defaultCodes,
      "\x1B[90m": "<dim>",
    }
  );
}

function one() {
  throw new Error("Uh oh!");
}

function two() {
  one();
}

function three() {
  two();
}

test("basic", () => {
  try {
    three();
  } catch (err) {
    const result = formatError(err, { color: false });
    expect(clean(result)).toMatchInlineSnapshot(`
      "Error: Uh oh!
        at one (<cwd>/src/index.test.ts:17:9)
        at two (<cwd>/src/index.test.ts:20:3)
        at three (<cwd>/src/index.test.ts:23:3)
        at <cwd>/src/index.test.ts:27:5
        at <cwd>/node_modules/vitest/dist/chunk-runtime-chain.2a787014.js:74:26
        at runTest (<cwd>/node_modules/vitest/dist/entry.js:1765:40)
        at async runSuite (<cwd>/node_modules/vitest/dist/entry.js:1829:13)
        at async runFiles (<cwd>/node_modules/vitest/dist/entry.js:1866:5)
        at async startTests (<cwd>/node_modules/vitest/dist/entry.js:1872:3)
        at async <cwd>/node_modules/vitest/dist/entry.js:1897:7"
    `);

    const result2 = formatError(err, { color: true });
    expect(clean(result2)).toMatchInlineSnapshot(`
      "<red>Error<resetColor>: Uh oh!
        <dim>at one (<cwd>/src/index.test.ts:17:9)<resetColor>
        <dim>at two (<cwd>/src/index.test.ts:20:3)<resetColor>
        <dim>at three (<cwd>/src/index.test.ts:23:3)<resetColor>
        <dim>at <cwd>/src/index.test.ts:27:5<resetColor>
        <dim>at <cwd>/node_modules/vitest/dist/chunk-runtime-chain.2a787014.js:74:26<resetColor>
        <dim>at runTest (<cwd>/node_modules/vitest/dist/entry.js:1765:40)<resetColor>
        <dim>at async runSuite (<cwd>/node_modules/vitest/dist/entry.js:1829:13)<resetColor>
        <dim>at async runFiles (<cwd>/node_modules/vitest/dist/entry.js:1866:5)<resetColor>
        <dim>at async startTests (<cwd>/node_modules/vitest/dist/entry.js:1872:3)<resetColor>
        <dim>at async <cwd>/node_modules/vitest/dist/entry.js:1897:7<resetColor>"
    `);
  }
});

test("basic", () => {
  try {
    three();
  } catch (err) {
    const result = formatError(err, { color: false });
    expect(clean(result)).toMatchInlineSnapshot(`
      "Error: Uh oh!
        at one (<cwd>/src/index.test.ts:17:9)
        at two (<cwd>/src/index.test.ts:20:3)
        at three (<cwd>/src/index.test.ts:23:3)
        at <cwd>/src/index.test.ts:61:5
        at <cwd>/node_modules/vitest/dist/chunk-runtime-chain.2a787014.js:74:26
        at runTest (<cwd>/node_modules/vitest/dist/entry.js:1765:40)
        at async runSuite (<cwd>/node_modules/vitest/dist/entry.js:1829:13)
        at async runFiles (<cwd>/node_modules/vitest/dist/entry.js:1866:5)
        at async startTests (<cwd>/node_modules/vitest/dist/entry.js:1872:3)
        at async <cwd>/node_modules/vitest/dist/entry.js:1897:7"
    `);

    const result2 = formatError(err, { color: true });
    expect(clean(result2)).toMatchInlineSnapshot(`
      "<red>Error<resetColor>: Uh oh!
        <dim>at one (<cwd>/src/index.test.ts:17:9)<resetColor>
        <dim>at two (<cwd>/src/index.test.ts:20:3)<resetColor>
        <dim>at three (<cwd>/src/index.test.ts:23:3)<resetColor>
        <dim>at <cwd>/src/index.test.ts:61:5<resetColor>
        <dim>at <cwd>/node_modules/vitest/dist/chunk-runtime-chain.2a787014.js:74:26<resetColor>
        <dim>at runTest (<cwd>/node_modules/vitest/dist/entry.js:1765:40)<resetColor>
        <dim>at async runSuite (<cwd>/node_modules/vitest/dist/entry.js:1829:13)<resetColor>
        <dim>at async runFiles (<cwd>/node_modules/vitest/dist/entry.js:1866:5)<resetColor>
        <dim>at async startTests (<cwd>/node_modules/vitest/dist/entry.js:1872:3)<resetColor>
        <dim>at async <cwd>/node_modules/vitest/dist/entry.js:1897:7<resetColor>"
    `);
  }
});

test("with code frame in error stack", () => {
  const err = new SyntaxError("Unexpected identifier");
  Object.defineProperty(err, "stack", {
    value:
      "evalmachine.<anonymous>:1\n(bla bla bla)\n     ^^^\n\nSyntaxError: Unexpected identifier\n    at new Script (node:vm:100:7)\n    at createScript (node:vm:257:10)\n    at Object.runInContext (node:vm:288:10)\n    at runExpression (/something/somewhere.js:235:20)\n    at evalmachine.<anonymous>:1:53\n    at /something/somewhere/@:76:16",
  });

  const result = formatError(err, { color: false });
  expect(clean(result)).toMatchInlineSnapshot(`
    "SyntaxError: Unexpected identifier
    evalmachine.<anonymous>:1
    (bla bla bla)
    ^^^
      at runExpression (/something/somewhere.js:235:20)
      at evalmachine.<anonymous>:1:53
      at /something/somewhere/@:76:16"
  `);

  const result2 = formatError(err, { color: true });
  expect(clean(result2)).toMatchInlineSnapshot(`
    "<red>SyntaxError<resetColor>: Unexpected identifier
    evalmachine.<anonymous>:1
    (bla bla bla)
    ^^^
      <dim>at runExpression (/something/somewhere.js:235:20)<resetColor>
      <dim>at evalmachine.<anonymous>:1:53<resetColor>
      <dim>at /something/somewhere/@:76:16<resetColor>"
  `);
});

test("with additional properties", () => {
  try {
    three();
  } catch (err) {
    (err as any).hi = "yes hello";
    const result = formatError(err, { color: false });
    expect(clean(result)).toMatchInlineSnapshot(`
      "Error: Uh oh!
        at one (<cwd>/src/index.test.ts:17:9)
        at two (<cwd>/src/index.test.ts:20:3)
        at three (<cwd>/src/index.test.ts:23:3)
        at <cwd>/src/index.test.ts:121:5
        at <cwd>/node_modules/vitest/dist/chunk-runtime-chain.2a787014.js:74:26
        at runTest (<cwd>/node_modules/vitest/dist/entry.js:1765:40)
        at async runSuite (<cwd>/node_modules/vitest/dist/entry.js:1829:13)
        at async runFiles (<cwd>/node_modules/vitest/dist/entry.js:1866:5)
        at async startTests (<cwd>/node_modules/vitest/dist/entry.js:1872:3)
        at async <cwd>/node_modules/vitest/dist/entry.js:1897:7
      The above error also had these properties on it:
      { hi: 'yes hello' }"
    `);

    const result2 = formatError(err, { color: true });
    expect(clean(result2)).toMatchInlineSnapshot(`
      "<red>Error<resetColor>: Uh oh!
        <dim>at one (<cwd>/src/index.test.ts:17:9)<resetColor>
        <dim>at two (<cwd>/src/index.test.ts:20:3)<resetColor>
        <dim>at three (<cwd>/src/index.test.ts:23:3)<resetColor>
        <dim>at <cwd>/src/index.test.ts:121:5<resetColor>
        <dim>at <cwd>/node_modules/vitest/dist/chunk-runtime-chain.2a787014.js:74:26<resetColor>
        <dim>at runTest (<cwd>/node_modules/vitest/dist/entry.js:1765:40)<resetColor>
        <dim>at async runSuite (<cwd>/node_modules/vitest/dist/entry.js:1829:13)<resetColor>
        <dim>at async runFiles (<cwd>/node_modules/vitest/dist/entry.js:1866:5)<resetColor>
        <dim>at async startTests (<cwd>/node_modules/vitest/dist/entry.js:1872:3)<resetColor>
        <dim>at async <cwd>/node_modules/vitest/dist/entry.js:1897:7<resetColor><magenta>
      The above error also had these properties on it:
      <resetColor>{ hi: <green>'yes hello'<resetColor> }"
    `);
  }
});
