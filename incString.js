#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  Your job is to write a function which increments a string, to create a      *
*  new string. If the string already ends with a number, the number should     *
*  be incremented by 1. If the string does not end with a number. the number   *
*  1 should be appended to the new string.                                     *
*                                                                              *
*  Examples:                                                                   *
*  foo -> foo1                                                                 *
*  foobar23 -> foobar24                                                        *
*  foo0042 -> foo0043                                                          *
*  foo9 -> foo10                                                               *
*  foo099 -> foo100                                                            *
*                                                                              *
*  Attention: If the number has leading zeros the amount of digits should      *
*  be considered.                                                              *
*******************************************************************************/

const incString = [
/*******************************************************************************
*  replace with a callback function                                            *
*******************************************************************************/
  ( str ) => str.replace( /\d*$/, d => `${ +d + 1 }`.padStart( d.length, "0" ) )
  ,

/*******************************************************************************
*  without padStart                                                            *
*******************************************************************************/
  ( str ) => str.replace( /[0-8]?9*$/, d => ++d )
  ,

];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [ "foobar23", "foobar24" ],
  [ "foo"     , "foo1"     ],
  [ "foo0042" , "foo0043"  ],
  [ "foo9"    , "foo10"    ],
  [ "foo099"  , "foo100"   ],
];

incString.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( input ), expected )
));
