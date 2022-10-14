import * as semigroup from "@fp-ts/core/Semigroup"
import * as number from "./data/number"
import * as string from "./data/string"
import * as U from "./util"

describe("Semigroup", () => {
  it("combine", () => {
    const S = string.Semigroup
    U.deepStrictEqual(S.combineMany("a", "b"), "ab")
    U.deepStrictEqual(S.combineMany("a", ["b"]), "ab")
  })

  it("min", () => {
    const S = semigroup.min(number.Compare)
    U.deepStrictEqual(S.combineMany(1, [3, 2]), 1)
  })

  it("max", () => {
    const S = semigroup.max(number.Compare)
    U.deepStrictEqual(S.combineMany(1, [3, 2]), 3)
  })

  it("struct", () => {
    const S = semigroup.struct({
      name: string.Semigroup,
      age: number.SemigroupSum
    })
    U.deepStrictEqual(S.combine({ name: "a", age: 10 }, { name: "b", age: 20 }), {
      name: "ab",
      age: 30
    })
  })

  it("tuple", () => {
    const S = semigroup.tuple(
      string.Semigroup,
      number.SemigroupSum
    )
    U.deepStrictEqual(S.combine(["a", 10], ["b", 20]), ["ab", 30])
  })

  it("first", () => {
    const S = semigroup.first<number>()
    U.deepStrictEqual(S.combineMany(1, [2, 3, 4, 5, 6]), 1)
  })

  it("last", () => {
    const S = semigroup.last<number>()
    U.deepStrictEqual(S.combineMany(1, []), 1)
    U.deepStrictEqual(S.combineMany(1, [2, 3, 4, 5, 6]), 6)
  })
})
