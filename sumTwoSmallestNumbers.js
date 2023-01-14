#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  Create a function that returns the sum of the two lowest positive           *
*  numbers given an array of minimum 4 positive integers. No floats or         *
*  non-positive integers will be passed.                                       *
*******************************************************************************/

const sumTwoSmallestNumbers = [
/*******************************************************************************
*  destructure assignment from sorted array                                    *
*******************************************************************************/
  A => { const [ a, b ] = A.sort( ( a, b ) => a - b ); return a + b; },

/*******************************************************************************
*  sort, slice and reduce                                                      *
*******************************************************************************/
  A => A.sort( ( a, b ) => a - b ).slice( 0, 2 ).reduce( ( a, b ) => a + b ),

/*******************************************************************************
*  sort once                                                                   *
*******************************************************************************/
  A => A.sort( ( a, b ) => a - b )[0] + A[1],
];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [ [  5,  8, 12, 19, 22 ], 13 ],
  [ [ 15, 28,  4,  2, 43 ],  6 ],
  [ [  3, 87, 45, 12,  7 ], 10 ],
  [ [ 23, 71, 33, 82,  1 ], 24 ],
  [ [ 52, 76, 14, 12,  4 ], 16 ],
];

sumTwoSmallestNumbers.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( input ), expected )
));
