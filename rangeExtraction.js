#! /usr/bin/env node
"use strict"
import assert from "node:assert"

//******************************************************************************
// Range extraction                                                            *
//                                                                             *
// A format for expressing an ordered list of integers is to use a comma       *
// separated list of either:                                                   *
//                                                                             *
// individual integers                                                         *
//                                                                             *
// or a range of integers denoted by the starting integer separated from the   *
// end integer in the range by a dash, '-'. The range includes all integers    *
// in the interval including both endpoints. It is not considered a range      *
// unless it spans at least 3 numbers. For example "12,13,15-17"               *
//                                                                             *
// Complete the solution so that it takes a list of integers in increasing     *
// order and returns a correctly formatted string in the range format.         *
//******************************************************************************

const rangeExtraction = [
  list => {
    let res = "";
    let temp = [list[0]];

    for (let i = 1; i < list.length; i++) {

      if (list[i] - list[i - 1] === 1)
        temp.push(list[i]);
      else {
        if (temp.length > 2) res += `${temp[0]}-${temp.at(-1)},`;
        else if (temp.length === 2) res += temp.join`,` + ",";
        else res += temp[0] + ",";

        temp = [list[i]];
      }
    }

    if (temp.length > 2) res += `${temp[0]}-${temp.at(-1)}`;
    else if (temp.length === 2) res += temp.join`,`;
    else res += temp[0];

    return res;
  },

  list => list
    .reduceRight(([first, ...rest], e, i, arr) =>
      1 + i - arr.length
        ? first[0] - e - 1
          ? [[e], first, ...rest]
          : [[e, ...first], ...rest]
        : [[e]]
      , [])
    .flatMap(e =>
      e.length > 2
        ? `${e[0]}-${e.at(-1)}`
        : e
    )
    .join`,`
];


//******************************************************************************
//  Tests                                                                      *
//******************************************************************************
const tests = [
  [
    [-10, -9, -8, -6, -3, -2, -1, 0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20],
    "-10--8,-6,-3-1,3-5,7-11,14,15,17-20",
  ], [
    [-6, -3, -2, -1, 0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20],
    "-6,-3-1,3-5,7-11,14,15,17-20",
  ]
];

console.log("--- Running tests", "-".repeat(62));

for (const func of rangeExtraction)
  for (const [input, expected] of tests)
    assert.deepEqual(func(input), expected);

console.log("--- Tests OK", "-".repeat(67));
