#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  Write a function that, given a string of text (possibly with punctuation    *
*  and line-breaks), returns an array of the top-3 most occurring words,       *
*  in descending order of the number of occurrences.                           *
*                                                                              *
*  Assumptions:                                                                *
*  A word is a string of letters (A to Z) optionally containing one or more    *
*  apostrophes (') in ASCII.                                                   *
*                                                                              *
*  Apostrophes can appear at the start, middle or end of a word ('abc, abc',   *
*  'abc', ab'c are all valid)                                                  *
*                                                                              *
*  Any other characters (e.g. #, \, / , . ...) are not part of a word and      *
*  should be treated as whitespace.                                            *
*                                                                              *
*  Matches should be case-insensitive, and the words in the result should      *
*  be lowercased.                                                              *
*                                                                              *
*  Ties may be broken arbitrarily.                                             *
*                                                                              *
*  If a text contains fewer than three unique words, then either the top-2     *
*  or top-1 words should be returned, or an empty array if a text contains     *
*  no words.                                                                   *
*                                                                              *
*  Examples:                                                                   *
*  top_3_words("In a village of La Mancha, the name of which I have no         *
*  desire to call to mind, there lived not long since one of those gentlemen   *
*  that keep a lance in the lance-rack, an old buckler, a lean hack, and a     *
*  greyhound for coursing. An olla of rather more beef than mutton, a salad    *
*  on most nights, scraps on Saturdays, lentils on Fridays, and a pigeon       *
*  or so extra on Sundays, made away with three-quarters of his income.")      *
*  # => ["a", "of", "on"]                                                      *
*                                                                              *
*  top_3_words("e e e e DDD ddd DdD: ddd ddd aa aA Aa, bb cc cC e e e")        *
*  # => ["e", "ddd", "aa"]                                                     *
*                                                                              *
*  top_3_words("  //wont won't won't")                                         *
*  # => ["won't", "wont"]                                                      *
*                                                                              *
*  Bonus points (not really, but just for fun):                                *
*  Avoid creating an array whose memory footprint is roughly as big as the     *
*  input text.                                                                 *
*  Avoid sorting the entire array of unique words.                             *
*******************************************************************************/

const topThreeWords = [
/*******************************************************************************
*                                                                              *
*******************************************************************************/
  ( A ) => {
    A = 
    [ ...A.toLowerCase() ]
    .map( c => (
    c.codePointAt()      >  96
    && c.codePointAt()   < 123
    || c.codePointAt() ===  39 )
    ? c
    : " " )
    .join``
    .split` `
    .filter( e => e !== "" && e !== "'" )
    .reduce( ( B, e ) => ({ ...B, [e] : ~~B[e] + 1 }), {} );

    A =
    [ ...Object.keys( A ) ]
    .sort( ( a, b ) => A[b] - A[a] )
    .slice( 0, 3 );

    return A;
  },

/*******************************************************************************
*                                                                              *
*******************************************************************************/
  ( A ) =>
    Object.entries(
    [ ...A.toLowerCase() ].reduce( ( B, c ) =>
    ( c.codePointAt() > 96 && c.codePointAt() < 123 || c.codePointAt() === 39 )
    ? { 
        word: B.word + c,
        freq: B.freq
      }
    : { 
        word: "",
        freq: B.word ? { ...B.freq, [B.word]: ~~B.freq[B.word] + 1 } : B.freq
      }
    , { word : "", freq : {} } ).freq )
    .sort( ( a, b ) => b[1] - a[1] )
    .reduce( ( B, e, i ) => i < 3 ? [ ...B, e[0] ] : B, [] )
  ,
/*******************************************************************************
*                                                                              *
*******************************************************************************/
  ( A ) => 
    Object.entries( ( A.toLowerCase().match( /'?\b[\w']+\b'?/g ) || [] )
    .reduce( ( B, e    ) => ( ( B[e] = ~~B[e] + 1 ), B ), {} ) )
    .sort(   ( a, b    ) => b[1] - a[1] )
    .reduce( ( B, e, i ) => i < 3 ? [ ...B, e[0] ] : B, [] ),

/*******************************************************************************
*                                                                              *
*******************************************************************************/
  ( text ) => {
    const chars = "abcdefghijklmnopqrstuvwxyz'";
    let freq    = {};
    let word    = "";
    let queue   = [];

    for ( let i = 0; i < text.length; i++ ) {
      const char = text[i].toLowerCase();

      if ( chars.includes( char ) ) {
        word += char;
        continue;
      } 

      if ( word === "" ) continue;

      freq[ word ] = freq[ word ] + 1 || 1;

      let temp = word;

      if ( !queue.length )
        queue.push( temp );

      else if ( 
        freq[ temp ]   > freq[ queue[0] ] ||
        freq[ temp ] === freq[ queue[0] ]
      )
        queue[0] = temp;

      if ( queue.length > 3 ) queue.pop();

      word = "";
    }

    console.log( 
      [ ...Object.entries( freq ) ]
      .sort( ( a, b ) => a[0].localeCompare( b[0] ) )
      .sort( ( a, b ) => freq[b[0]] - freq[a[0]] )
    );

    console.log( queue );
  },

];

topThreeWords[3](
`In of of a village of La Mancha, the name of which I have no desire to
call to mind, there lived not long since one of those gentlemen that
keep a lance in the lance-rack, an old buckler, a lean hack, and a
greyhound for coursing. An olla of rather more beef than mutton,
a salad on most nights, scraps on Saturdays, lentils on Fridays,
and a pigeon or so extra on Sundays, made away with three-quarters
of his income.`
);

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
// const tests = [
//   [ "a a a  b  c c  d d d d  e e e e e",
//     ['e','d','a'],
//   ],
//   [ "a a c b b",
//     ['a','b','c'],
//   ],
//   [ "e e e e DDD ddd DdD: ddd ddd aa aA Aa, bb cc cC e e e",
//     ['e','ddd','aa'],
//   ],
//   [ "  //wont won't won't wont'",
//     ["won't", "wont", "wont'" ],
//   ],
//   [ "  , e   .. ",
//     ["e"],
//   ],
//   [ "  ...  ",
//     [],
//   ],
//   [ "  '  ",
//     [],
//   ],
//   [ `In a village of La Mancha, the name of which I have no desire to
//     call to mind, there lived not long since one of those gentlemen that
//     keep a lance in the lance-rack, an old buckler, a lean hack, and a
//     greyhound for coursing. An olla of rather more beef than mutton,
//     a salad on most nights, scraps on Saturdays, lentils on Fridays,
//     and a pigeon or so extra on Sundays, made away with three-quarters
//     of his income.`,
//     ['a','of','on'],
//   ],
// ];
//
// topThreeWords.forEach( func =>
//   tests.forEach( ([ input, expected ]) =>
//     assert.deepEqual( func( input ), expected )
// ));
