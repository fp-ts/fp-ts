/**
 * @since 1.0.0
 */
import type { BoundedTotalOrder } from "@fp-ts/core/typeclass/BoundedTotalOrder"
import type { Semigroup } from "@fp-ts/core/typeclass/Semigroup"
import * as semigroup from "@fp-ts/core/typeclass/Semigroup"

/**
 * @category type class
 * @since 1.0.0
 */
export interface Monoid<A> extends Semigroup<A> {
  readonly unit: A
  readonly combineAll: (collection: Iterable<A>) => A
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const fromSemigroup = <A>(S: Semigroup<A>, unit: A): Monoid<A> => ({
  ...S,
  unit,
  combineAll: collection => S.combineMany(collection)(unit)
})

/**
 * Get a monoid where `combine` will return the minimum, based on the provided bounded order.
 *
 * The `unit` value is the `maximum` value.
 *
 * @category constructors
 * @since 1.0.0
 */
export const min = <A>(BoundedTotalOrder: BoundedTotalOrder<A>): Monoid<A> =>
  fromSemigroup(semigroup.min(BoundedTotalOrder), BoundedTotalOrder.maximum)

/**
 * Get a monoid where `combine` will return the maximum, based on the provided bounded order.
 *
 * The `unit` value is the `minimum` value.
 *
 * @category constructors
 * @since 1.0.0
 */
export const max = <A>(BoundedTotalOrder: BoundedTotalOrder<A>): Monoid<A> =>
  fromSemigroup(semigroup.max(BoundedTotalOrder), BoundedTotalOrder.minimum)

/**
 * The dual of a `Monoid`, obtained by swapping the arguments of `combine`.
 *
 * @since 1.0.0
 */
export const reverse = <A>(Monoid: Monoid<A>): Monoid<A> =>
  fromSemigroup(semigroup.reverse(Monoid), Monoid.unit)

/**
 * Given a struct of monoids returns a monoid for the struct.
 *
 * @since 1.0.0
 */
export const struct = <A>(
  monoids: { [K in keyof A]: Monoid<A[K]> }
): Monoid<{ readonly [K in keyof A]: A[K] }> => {
  const unit: A = {} as any
  for (const k in monoids) {
    if (Object.prototype.hasOwnProperty.call(monoids, k)) {
      unit[k] = monoids[k].unit
    }
  }
  return fromSemigroup(semigroup.struct(monoids), unit)
}

/**
 * Given a tuple of monoids returns a monoid for the tuple.
 *
 * @since 1.0.0
 */
export const tuple = <A extends ReadonlyArray<unknown>>(
  ...monoids: { [K in keyof A]: Monoid<A[K]> }
): Monoid<Readonly<A>> => {
  const unit: A = monoids.map((m) => m.unit) as any
  return fromSemigroup(semigroup.tuple(...monoids), unit)
}
