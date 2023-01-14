#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  A pangram is a sentence that contains every single letter of the            *
*  alphabet at least once. For example, the sentence "The quick brown fox      *
*  jumps over the lazy dog" is a pangram, because it uses the letters A-Z      *
*  at least once (case is irrelevant). Given a string, detect whether          *
*  or not it is a pangram. Return True if it is, False if not. Ignore          *
*  numbers and punctuation.                                                    *
*******************************************************************************/

const isPangram = [
/*******************************************************************************
*  using Set                                                                   *
*******************************************************************************/
  string => new Set( string.toLowerCase().match( /[a-z]/g ) ).size === 26,
];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [ "Cwm fjord bank glyphs vext quiz"         , true  ],
  [ "Pack my box with five dozen liquor jugs.", true  ],
  [ "How quickly daft jumping zebras vex."    , true  ],
  [ "ABCD45EFGH,IJK,LMNOPQR56STUVW3XYZ"       , true  ],
  [ "AbCdEfGhIjKlM zYxWvUtSrQpOn"             , true  ],
  [ "This isn't a pangram!"                   , false ],
  [ "abcdefghijklmopqrstuvwxyz "              , false ],
  [ "aaaaaaaaaaaaaaaaaaaaaaaaaa"              , false ],
  [ "Detect Pangram"                          , false ],
  [ "A pangram is a sentence that contains "  + 
    "every single letter of the alphabet "    +
    " at least once."                         , false ],
];

isPangram.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( input ), expected )
));
