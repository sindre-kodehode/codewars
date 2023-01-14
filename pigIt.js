#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  Move the first letter of each word to the end of it, then add "ay"          *
*  to the end of the word. Leave punctuation marks untouched.                  *
*                                                                              *
*  Examples                                                                    *
*  pigIt('Pig latin is cool'); // igPay atinlay siay oolcay                    *
*  pigIt('Hello world !');     // elloHay orldway !                            *
*******************************************************************************/

const pigIt = [
  ( str ) => str.replace( /(\w)(\w*)/g, "$2$1ay" ),
];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [ "Pig latin is cool", "igPay atinlay siay oolcay" ],
  [ "This is my string", "hisTay siay ymay tringsay" ],
];

pigIt.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( input ), expected )
));
