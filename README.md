# pretty-print-error

A little function that formats an error object as a nice, readable string. Works in node and the browser; in node, it will use [kleur](https://www.npmjs.com/package/kleur) to add ANSI color code escape sequences to the output string, to make it easier to read.

## Features

- Works in both node and the browser
- Browser version is only ~2k
- Error name and stack are printed in color
- Handles non-error inputs gracefully (accepts `unknown` in TypeScript)
- Also prints any additional properties that were added to the Error object
  - This is particularly nice when working with node's `fs` errors; the information about eg "which file couldn't be read" is sometimes in a property on the error, instead of in the error message.

## Example

![Sample output of using pretty-print-error in the node repl. See the "Usage" section below for the code used in this screenshot.](https://user-images.githubusercontent.com/1341513/154799473-7189121d-cf5f-41f3-851c-3d358ec365a9.png)

## Installation

```
npm install pretty-print-error
```

## Usage

```ts
import { formatError } from "pretty-print-error";

const error = new Error("uh oh!");

error.context = {
  user: "jeff",
  session: "ewnj75hvj3v4tvmuy43er",
  favoriteIceCreamFlavor: "pineapple",
};

console.log(formatError(error));
/*
  Logs:

  Error uh oh!
    at REPL2:1:9
    at Script.runInThisContext (node:vm:129:12)
    at REPLServer.defaultEval (node:repl:562:29)
    at bound (node:domain:421:15)
    at REPLServer.runBound [as eval] (node:domain:432:12)
    at REPLServer.onLine (node:repl:889:10)
    at REPLServer.emit (node:events:402:35)
    at REPLServer.emit (node:domain:475:12)
    at REPLServer.Interface._onLine (node:readline:487:10)
    at REPLServer.Interface._line (node:readline:864:8)
  The above error also had these properties on it:
  {
    context: {
      user: 'jeff',
      session: 'ewnj75hvj3v4tvmuy43er',
      favoriteIceCreamFlavor: 'pineapple'
    }
  }
*/
```

## License

MIT
