/**
 * @since 1.0.0
 */
import type * as contravariant from "@fp-ts/core/Contravariant"
import type { TypeLambda } from "@fp-ts/core/HKT"

/**
 * @category type class
 * @since 1.0.0
 */
export interface Show<A> {
  readonly show: (a: A) => string
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ShowTypeLambda extends TypeLambda {
  readonly type: Show<this["In1"]>
}

/**
 * @since 1.0.0
 */
export const contramap: <B, A>(f: (b: B) => A) => (self: Show<A>) => Show<B> = (f) =>
  (self) => ({
    show: (b) => self.show(f(b))
  })

/**
 * @category instances
 * @since 1.0.0
 */
export const Contravariant: contravariant.Contravariant<ShowTypeLambda> = {
  contramap
}

/**
 * @since 1.0.0
 */
export const struct = <A>(
  shows: { [K in keyof A]: Show<A[K]> }
): Show<{ readonly [K in keyof A]: A[K] }> => ({
  show: (a) => {
    let s = "{"
    for (const k in shows) {
      if (Object.prototype.hasOwnProperty.call(shows, k)) {
        s += ` ${k}: ${shows[k].show(a[k])},`
      }
    }
    if (s.length > 1) {
      s = s.slice(0, -1) + " "
    }
    s += "}"
    return s
  }
})

/**
 * @since 1.0.0
 */
export const tuple = <A extends ReadonlyArray<unknown>>(
  ...shows: { [K in keyof A]: Show<A[K]> }
): Show<Readonly<A>> => ({
  show: (t) => `[${t.map((a, i) => shows[i].show(a)).join(", ")}]`
})
