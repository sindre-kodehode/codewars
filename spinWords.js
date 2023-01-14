#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  Write a function that takes in a string of one or more words, and           *
*  returns the same string, but with all five or more letter words             *
*  reversed (Just like the name of this Kata). Strings passed in will          *
*  consist of only letters and spaces. Spaces will be included only when       *
*  more than one word is present.                                              *
*******************************************************************************/

const spinWords = [
/*******************************************************************************
*  using split, reverse, join                                                  *
*******************************************************************************/
  string =>
    string.split` `.map( word => 
      word.length >= 5 ? [ ...word ].reverse().join`` : word
    ).join` `,

/*******************************************************************************
*  using regex to capture words                                                *
*******************************************************************************/
  string =>
    string.replace( /\w{5,}/g, word => [ ...word ].reverse().join`` )
];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [ "Welcome"                             , "emocleW"                              ],
  [ "Hey fellow warriors"                 , "Hey wollef sroirraw"                  ],
  [ "This is a test"                      , "This is a test"                       ],
  [ "This is another test"                , "This is rehtona test"                 ],
  [ "This sentence is a sentence"         , "This ecnetnes is a ecnetnes"          ],
  [ "You are almost to the last test"     , "You are tsomla to the last test"      ],
  [ "Just kidding there is still one more", "Just gniddik ereht is llits one more" ],
  [ "Seriously this is the last one"      , "ylsuoireS this is the last one"       ],
];

spinWords.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( input ), expected )
));
