import * as E from "@fp-ts/core/Either"
import * as O from "@fp-ts/core/Option"
import * as RA from "@fp-ts/core/ReadonlyArray"
import * as _ from "@fp-ts/core/typeclass/TraversableFilterable"
import * as U from "../util"

describe("TraversableFilterable", () => {
  it("traversePartitionMap", () => {
    const traversePartitionMap: <A, B, C>(
      self: ReadonlyArray<A>,
      f: (a: A) => O.Option<E.Either<B, C>>
    ) => O.Option<[ReadonlyArray<B>, ReadonlyArray<C>]> = _.traversePartitionMap({
      ...RA.Traversable,
      ...RA.Covariant,
      ...RA.Compactable
    })(O.Applicative)
    const f = (s: string) =>
      s.length > 1 ? O.some(E.right(s)) : s.length > 0 ? O.some(E.left(s)) : O.none()
    assert.deepStrictEqual(traversePartitionMap([], f), O.some([[], []]))
    assert.deepStrictEqual(traversePartitionMap([""], f), O.none())
    assert.deepStrictEqual(traversePartitionMap(["a"], f), O.some([["a"], []]))
    assert.deepStrictEqual(traversePartitionMap(["aa"], f), O.some([[], ["aa"]]))
    assert.deepStrictEqual(traversePartitionMap(["aa", "a", ""], f), O.none())
    assert.deepStrictEqual(
      traversePartitionMap(["aa", "a", "aaa"], f),
      O.some([["a"], ["aa", "aaa"]])
    )
  })

  it("traverseFilterMap", () => {
    const traverseFilterMap: <A, B>(
      self: ReadonlyArray<A>,
      f: (a: A) => O.Option<O.Option<B>>
    ) => O.Option<ReadonlyArray<B>> = _.traverseFilterMap({
      ...RA.Traversable,
      ...RA.Compactable
    })(O.Applicative)
    const f = (s: string) =>
      s.length > 1 ? O.some(O.some(s)) : s.length > 0 ? O.some(O.none()) : O.none()
    assert.deepStrictEqual(traverseFilterMap([], f), O.some([]))
    assert.deepStrictEqual(traverseFilterMap([""], f), O.none())
    assert.deepStrictEqual(traverseFilterMap(["a"], f), O.some([]))
    assert.deepStrictEqual(traverseFilterMap(["aa"], f), O.some(["aa"]))
    assert.deepStrictEqual(traverseFilterMap(["aa", "a", ""], f), O.none())
    assert.deepStrictEqual(
      traverseFilterMap(["aa", "a", "aaa"], f),
      O.some(["aa", "aaa"])
    )
  })

  it("traverseFilter", () => {
    const traverseFilter = _.traverseFilter(
      RA.TraversableFilterable
    )(O.Applicative)
    const f = traverseFilter((s: string) =>
      s.length > 2 ? O.some(false) : s.length > 1 ? O.some(true) : O.none()
    )
    U.deepStrictEqual(f([]), O.some([]))
    U.deepStrictEqual(f(["a"]), O.none())
    U.deepStrictEqual(f(["a", "aa"]), O.none())
    U.deepStrictEqual(f(["aa"]), O.some(["aa"]))
    U.deepStrictEqual(f(["aaa"]), O.some([]))
    U.deepStrictEqual(f(["aaa", "aa"]), O.some(["aa"]))
  })

  it("traversePartition", () => {
    const traversePartition = _.traversePartition(
      RA.TraversableFilterable
    )(O.Applicative)
    const f = traversePartition((s: string) =>
      s.length > 2 ? O.some(false) : s.length > 1 ? O.some(true) : O.none()
    )
    expect(f([])).toEqual(O.some([[], []]))
    expect(f(["a"])).toEqual(O.none())
    expect(f(["a", "aa"])).toEqual(O.none())
    expect(f(["aa"])).toEqual(O.some([[], ["aa"]]))
    expect(f(["aaa"])).toEqual(O.some([["aaa"], []]))
    expect(f(["aaa", "aa"])).toEqual(O.some([["aaa"], ["aa"]]))
  })
})
