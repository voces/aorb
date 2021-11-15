import { formatList } from "../util.ts";

let assertions: string[] = [];
let asserting = false;
let assertPath: string[] = [];
export const path = () =>
  assertPath.length ? `'${assertPath.join(".")}'` : "value";

export const assert: <U>(
  v: unknown,
  fn: (v: unknown) => v is U,
) => asserts v is U = <
  U,
>(
  v: unknown,
  fn: (v: unknown) => v is U,
): asserts v is U => {
  assertions = [];
  assertPath = [];
  asserting = true;
  const ret = fn(v);
  asserting = false;
  if (!ret) {
    throw new Error("Assert failed");
  }
};

export const getAssertions = () => [...assertions];

export const isRecord = (v: unknown): v is Record<string, unknown> => {
  if (typeof v !== "object" || !v) {
    if (asserting) {
      assertions.push(
        `Expected ${path()} to be object, got ${v}`,
      );
    }
    return false;
  }
  return true;
};

export const isString = (v: unknown): v is string => {
  if (typeof v !== "string") {
    if (asserting) {
      assertions.push(
        `Expected ${path()} to be string, got ${v}`,
      );
    }
    return false;
  }
  return true;
};

export const isNumber = (v: unknown): v is number => {
  if (typeof v !== "number") {
    if (asserting) {
      assertions.push(
        `Expected ${path()} to be number, got ${v}`,
      );
    }
    return false;
  }
  return true;
};

export const isEnum = <T>(v: unknown, enumValues: T[]): v is T => {
  if (!enumValues.some((e) => v === e)) {
    if (asserting) {
      assertions.push(
        `Expected ${path()} to be ${
          formatList(enumValues.map((v) => `'${v}'`))
        }, got ${v}`,
      );
    }
    return false;
  }
  return true;
};

export const factor = <T>(...enumValues: T[]) =>
  (v: unknown): v is T => isEnum(v, enumValues);

export const is = <
  O,
>(
  v: unknown,
  map: { [P in keyof O]: ((v: unknown) => v is O[P]) },
): v is O => {
  let ret = true;

  if (!isRecord(v)) return false;

  for (const key in map) {
    if (asserting) {
      assertPath.push(key);
      if (!map[key](v[key])) ret = false;
      assertPath.pop();
    } else if (!map[key](v[key])) return false;
  }

  for (const key in v) {
    if (!(key in map)) {
      if (asserting) {
        assertPath.push(key);
        assertions.push(`Unexpected property ${path()}`);
        assertPath.pop();
        ret = false;
      } else return false;
    }
  }

  return ret;
};

export const r = <
  O,
>(
  map: { [P in keyof O]: ((v: unknown) => v is O[P]) },
): (v: unknown) => v is O => (v: unknown): v is O => is(v, map);
