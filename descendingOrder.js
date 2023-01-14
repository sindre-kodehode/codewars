#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  Your task is to make a function that can take any non-negative              *
*  integer as an argument and return it with its digits in descending          *
*  order. Essentially, rearrange the digits to create the highest              *
*  possible number.                                                            *
*******************************************************************************/

const descendingOrder = [
/*******************************************************************************
*  multi-line solution                                                         *
*******************************************************************************/
  n => {
    n = n.toString()           // convert from integer to string
    .split( "" )               // split into an array of characters
    .sort( ( a, b ) => b - a ) // sort in descending order
    .join( "" )                // join back into a single string

    return parseInt( n );      // return the string parsed as an integer
  },

/*******************************************************************************
*  as a one-liner                                                              *
*******************************************************************************/
  n => +[ ...`${n}` ].sort().reverse().join``,
];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [         0, 0         ],
  [         1, 1         ],
  [       111, 111       ],
  [        15, 51        ],
  [      1021, 2110      ],
  [ 123456789, 987654321 ],
];

descendingOrder.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( input ), expected )
));
