/**
 * @since 1.0.0
 */
import type { Covariant } from "@fp-ts/core/Covariant"
import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import { identity } from "@fp-ts/core/internal/Function"

/**
 * @category type class
 * @since 1.0.0
 */
export interface Bifunctor<F extends TypeLambda> extends TypeClass<F> {
  readonly mapBoth: <E, G, A, B>(
    f: (e: E) => G,
    g: (a: A) => B
  ) => <S, R, O>(self: Kind<F, S, R, O, E, A>) => Kind<F, S, R, O, G, B>
}

/**
 * @since 1.0.0
 */
export const mapLeft = <F extends TypeLambda>(
  Bifunctor: Bifunctor<F>
): (<E, G>(
  f: (e: E) => G
) => <S, R, O, A>(self: Kind<F, S, R, O, E, A>) => Kind<F, S, R, O, G, A>) =>
  <E, G>(f: (e: E) => G): (<S, R, O, A>(self: Kind<F, S, R, O, E, A>) => Kind<F, S, R, O, G, A>) =>
    Bifunctor.mapBoth(f, identity)

/**
 * Returns a default `map` implementation.
 *
 * @since 1.0.0
 */
export const map = <F extends TypeLambda>(Bifunctor: Bifunctor<F>): Covariant<F>["map"] =>
  <A, B>(f: (a: A) => B): (<S, R, O, E>(self: Kind<F, S, R, O, E, A>) => Kind<F, S, R, O, E, B>) =>
    Bifunctor.mapBoth(identity, f)

/**
 * Returns a default `mapBoth` composition.
 *
 * @since 1.0.0
 */
export const mapBothComposition = <F extends TypeLambda, G extends TypeLambda>(
  CovariantF: Covariant<F>,
  BifunctorG: Bifunctor<G>
) =>
  <GE, GG, A, B>(
    f: (e: GE) => GG,
    g: (a: A) => B
  ): (<FS, FR, FO, FE, GS, GR, GO>(
    self: Kind<F, FS, FR, FO, FE, Kind<G, GS, GR, GO, GE, A>>
  ) => Kind<F, FS, FR, FO, FE, Kind<G, GS, GR, GO, GG, B>>) =>
    CovariantF.map(BifunctorG.mapBoth(f, g))
