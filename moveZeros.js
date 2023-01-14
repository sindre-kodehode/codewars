#! /usr/bin/env node
"use strict"
import assert from "node:assert"

//******************************************************************************
//  Write an algorithm that takes an array and moves all of the zeros to       *
//  the end, preserving the order of the other elements.                       *
//******************************************************************************

const moveZeros = [
  arr => {
    const a = [], b = [];

    for (const e of arr) {
      if (e === 0) b.push(e);
      else a.push(e);
    }

    return a.concat(b);
  },

  arr => arr.reduceRight((a, e) => e === 0 ? [...a, e] : [e, ...a], []),

  arr => arr.filter(e => e !== 0).concat(arr.filter(e => e === 0)),

  arr => arr.sort((_, b) => b === 0 ? -1 : 0),
];


//******************************************************************************
//  Tests                                                                      *
//******************************************************************************
const tests = [
  [[1, 2, 0, 1, 0, 1, 0, 3, 0, 1], [1, 2, 1, 1, 3, 1, 0, 0, 0, 0]],
  [[false, 1, 0, 1, 2, 0, 1, 3, "a"], [false, 1, 1, 2, 1, 3, "a", 0, 0]],
  [['a', 'b', null, 'c', 'd', 1, false, 1, 3, [], 1, 9, {}, 9, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0],
  ['a', 'b', null, 'c', 'd', 1, false, 1, 3, [], 1, 9, {}, 9, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0]],
];

console.log("--- Running tests", "-".repeat(62));

for (const func of moveZeros)
  for (const [input, expected] of tests)
    assert.deepEqual(func(input), expected);

console.log("--- Tests OK", "-".repeat(67));
