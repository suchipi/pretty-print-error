let isNode = false;
try {
  isNode = process.argv0 != null;
} catch (err) {
  // ignored
}

const fakeKleur = {
  red: (value: string) => value,
  gray: (value: string) => value,
  magenta: (value: string) => value,
};
let autoDetectedKleur = fakeKleur;
if (isNode) {
  // I use eval("require") here instead of just require,
  // so that webpack et. al don't try to bundle util into
  // browser stuff, since it won't be used even if it's
  // bundled, and because most util shims for browsers
  // are huge.
  autoDetectedKleur = eval("require")("kleur");
}

/**
 * Formats an Error into a string suitable for printing.
 *
 * @param err The Error object to format. If the value you pass in isn't error-like, it'll get formatted via `String()`.
 * @param options Options that affect the format of the returned string.
 * @returns A formatted string containing information about the error.
 */
export function formatError(
  err: unknown,
  {
    color = true,
  }: {
    /**
     * Whether to use ANSI color escape sequences in the output string.
     *
     * This does nothing in the browser.
     */
    color?: boolean;
  } = {}
): string {
  const kleur = color ? autoDetectedKleur : fakeKleur;

  let prettyErr = String(err);

  if (
    typeof err === "object" &&
    err != null &&
    // @ts-ignore
    typeof err.name === "string" &&
    // @ts-ignore
    typeof err.message === "string" &&
    // @ts-ignore
    typeof err.stack === "string"
  ) {
    const error = err as Error;

    prettyErr =
      kleur.red(error.name) +
      " " +
      error.message.replace(new RegExp(`^${error.name}[: ]*`), "") +
      "\n" +
      (error.stack || "")
        .split("\n")
        .map((line) => line.trim())
        .map((line, index) => {
          if (index === 0) return null;

          return "  " + kleur.gray(line);
        })
        .filter(Boolean)
        .join("\n");
  }

  if (typeof err === "object" && err != null) {
    const propNames = Object.getOwnPropertyNames(err).filter(
      (name) => name !== "stack" && name !== "message"
    );
    if (propNames.length > 0) {
      const props = {};
      propNames.forEach((name) => {
        props[name] = err[name];
      });

      let propertiesString;
      if (isNode) {
        // I use eval("require") here instead of just require,
        // so that webpack et. al don't try to bundle util into
        // browser stuff, since it won't be used even if it's
        // bundled, and because most util shims for browsers
        // are huge.
        const util = eval("require")("util");

        propertiesString = util.inspect(props, {
          depth: Infinity,
          colors: true,
        });
      } else {
        try {
          propertiesString = JSON.stringify(props);
        } catch (err) {
          propertiesString = [
            "{",
            "  the properties object couldn't be converted to JSON :(",
            "",
            "  the error that happened while stringifying it was:",
            formatError(err)
              .split("\n")
              .map((line) => "  " + line)
              .join("\n"),
            "}",
          ].join("\n");
        }
      }

      prettyErr +=
        kleur.magenta("\nThe above error also had these properties on it:\n") +
        propertiesString;
    }
  }

  return prettyErr;
}