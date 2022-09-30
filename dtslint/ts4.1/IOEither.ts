import * as _ from '../../src/IOEither'
import * as IO from '../../src/IO'
import * as E from '../../src/Either'
import { identity, pipe } from '../../src/function'

declare const n: number
declare const sn: string | number
declare const isString: (u: unknown) => u is string
declare const predicate: (sn: string | number) => boolean
declare const fsn: _.IOEither<boolean, string | number>
declare const fn: _.IOEither<boolean, number>

// -------------------------------------------------------------------------------------
// ap widening
// -------------------------------------------------------------------------------------

declare const fab: _.IOEither<string, (n: number) => boolean>
declare const fa: _.IOEither<Error, number>
// $ExpectType IOEither<string | Error, boolean>
_.ap(fa)(fab)

// -------------------------------------------------------------------------------------
// flatMap widening
// -------------------------------------------------------------------------------------

// $ExpectType IOEither<never, number>
pipe(
  _.right('a'),
  _.flatMap(() => _.right(1))
)

// $ExpectType IOEither<number, number>
pipe(
  _.right('a'),
  _.flatMap(() => _.right(1) as _.IOEither<number, number>)
)

// $ExpectType IOEither<string | number, number>
pipe(
  _.right('a') as _.IOEither<string, string>,
  _.flatMap(() => _.right(1) as _.IOEither<number, number>)
)

// -------------------------------------------------------------------------------------
// fromRefinement
// -------------------------------------------------------------------------------------

// $ExpectType IOEither<string | number, string>
pipe(sn, _.liftPredicate(isString, identity))

// $ExpectType IOEither<Error, string>
pipe(
  sn,
  _.liftPredicate(
    isString,
    (
      _n // $ExpectType string | number
    ) => new Error()
  )
)

pipe(
  sn,
  _.liftPredicate(
    (
      n // $ExpectType string | number
    ): n is number => typeof n === 'number',
    identity
  )
)

// -------------------------------------------------------------------------------------
// fromPredicate
// -------------------------------------------------------------------------------------

// $ExpectType IOEither<string | number, string | number>
pipe(sn, _.liftPredicate(predicate, identity))

// $ExpectType IOEither<Error, string | number>
pipe(
  sn,
  _.liftPredicate(predicate, () => new Error())
)

// $ExpectType IOEither<number, number>
pipe(n, _.liftPredicate(predicate, identity))

pipe(
  n,
  _.liftPredicate(
    (
      _n // $ExpectType number
    ) => true,
    identity
  )
)

// -------------------------------------------------------------------------------------
// refine
// -------------------------------------------------------------------------------------

// $ExpectType IOEither<string | number | boolean, string>
pipe(fsn, _.filter(isString, identity))

// $ExpectType IOEither<boolean | Error, string>
pipe(
  fsn,
  _.filter(
    isString,
    (
      _n // $ExpectType string | number
    ) => new Error()
  )
)

pipe(
  fsn,
  _.filter(
    (
      n // $ExpectType string | number
    ): n is number => typeof n === 'number',
    identity
  )
)

// -------------------------------------------------------------------------------------
// filter
// -------------------------------------------------------------------------------------

// $ExpectType IOEither<string | number | boolean, string | number>
pipe(fsn, _.filter(predicate, identity))

// $ExpectType IOEither<boolean | Error, string | number>
pipe(
  fsn,
  _.filter(predicate, () => new Error())
)

// $ExpectType IOEither<number | boolean, number>
pipe(fn, _.filter(predicate, identity))

pipe(
  fn,
  _.filter(
    (
      _n // $ExpectType number
    ) => true,
    identity
  )
)

//
// -------------------------------------------------------------------------------------
//

//
// getOrElse
//

// $ExpectType IO<string | null>
pipe(
  _.right('a'),
  _.getOrElse(() => null)
)

//
// getOrElseIO
//

// $ExpectType IO<string | null>
pipe(
  _.right('a'),
  _.getOrElseIO(() => IO.of(null))
)

//
// flatMapEitherK
//

// $ExpectType IOEither<string | number, number>
pipe(
  // tslint:disable-next-line: no-unnecessary-type-assertion
  _.right('a') as _.IOEither<string, string>,
  _.flatMapEither(() => E.right(1) as E.Either<number, number>)
)

//
// do notation
//

// $ExpectType IOEither<string | number, { readonly a1: number; readonly a2: string; readonly a3: boolean; }>
pipe(
  _.right(1) as _.IOEither<string, number>,
  _.bindTo('a1'),
  _.bind('a2', () => _.right('b')),
  _.bind('a3', () => _.right(true) as _.IOEither<number, boolean>)
)

//
// pipeable sequence S
//

// $ExpectType IOEither<string | number, { readonly a1: number; readonly a2: string; readonly a3: boolean; }>
pipe(
  _.right(1) as _.IOEither<string, number>,
  _.bindTo('a1'),
  _.bindRight('a2', _.right('b')),
  _.bindRight('a3', _.right(true) as _.IOEither<number, boolean>)
)

//
// Do
//

// $ExpectType IOEither<string, { readonly a1: number; readonly a2: string; }>
pipe(
  _.Do,
  _.bind('a1', () => _.right(1) as _.IOEither<string, number>),
  _.bind('a2', () => _.right('b') as _.IOEither<string, string>)
)

//
// filter
//

// $ExpectType IOEither<"a1" | "a2", number>
pipe(
  _.left('a1') as _.IOEither<'a1', number>,
  _.filter(
    (result) => result > 0,
    () => 'a2' as const
  )
)
