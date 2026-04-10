/* eslint-disable @typescript-eslint/no-explicit-any */
/** Super sany -- avoids eslint errors. Use sparingly! */
type sany = any
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Should be fixed at some point */
type TSFIXME = sany

/** Loose function shape used in legacy helper typings. */
type Fnc = (...args: sany[]) => sany

/** Async callback signature alias. */
type PromiseFnc = (...args: sany[]) => Promise<sany>

/** Sync return type of an `Fnc`-constrained callable. */
type ReturnType<T extends Fnc> = T extends (...args: sany[]) => infer R ? R : never

// eslint-disable-next-line @typescript-eslint/ban-types
/** Like `ReturnType` but allows any `Function` implementer. */
type ReturnTypeLoose<T extends Function> = T extends (...args: sany[]) => infer R ? R : never

/** Promise element type after unwrapping an async function’s return. */
type ReturnTypeP<T extends (...args: sany[]) => sany> = ThenArg<ReturnType<T>>
/** Resolves `T` when it is `PromiseLike<U>`, otherwise `T`. */
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

/**
 * Make all properties in T never
 */
type Never<T> = {
  [P in keyof T]?: never
}
/**
 * Make properties either normal or never
 */
type AllOrNothing<T> = T | Never<T>

/**
 * Accepts any type that's not an array
 */
type NonArray =
  | {
      length?: never
      [key: string]: sany
    }
  | string
  | bigint
  | number
  | boolean
