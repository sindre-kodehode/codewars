#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*   Return an array containing the numbers from 1 to N, where N is the         *
*   parametered value.                                                         *
*                                                                              *
*   Replace certain values however if any of the following conditions          *
*   are met:                                                                   *
*                                                                              *
*   If the value is a multiple of 3: use the value "Fizz" instead              *
*   If the value is a multiple of 5: use the value "Buzz" instead              *
*   If the value is a multiple of 3 & 5: use the value "FizzBuzz" instead      *
*   N will never be less than 1.                                               *
*                                                                              *
*   Example:                                                                   *
*   fizzbuzz(3) -->  [1, 2, "Fizz"]                                            *
*******************************************************************************/
  
const fizzbuzz = [
/*******************************************************************************
*  push to result array                                                        *
*******************************************************************************/
   n => {
    // array to store the result
    const result = []

    // loop from 1 to including n
    for (let i = 1; i <= n; i++)
      
      // add FizzBuzz to result if divisible by 3 and 5
      if (i % 3 === 0 && i % 5 === 0) result.push('FizzBuzz');

      // add Fizz to result if divisible by 3
      else if (i % 3 === 0) result.push('Fizz');

      // add Fizz to result if divisible by 5
      else if (i % 5 === 0) result.push('Buzz');

      // else just push the regular number
      else result.push( i );

    // return the resulting array
    return result;
  },

/*******************************************************************************
*  using index to add to array                                                 *
*******************************************************************************/
   n => {
    const result = Array( n + 1 );

    for ( let i = 1; i < result.length; i++ )

      if      ( i % 15 === 0 ) result[i] = 'FizzBuzz';
      else if ( i %  3 === 0 ) result[i] = 'Fizz';
      else if ( i %  5 === 0 ) result[i] = 'Buzz';
      else                     result[i] = i;

    result.shift();
    return result;
  },

/*******************************************************************************
*  using multiple for loops                                                    *
*******************************************************************************/
   n => {
    const result = Array( ++n );

    let i;

    for( i = 0; i < n; i +=  1 ) result[i] = i;
    for( i = 0; i < n; i +=  3 ) result[i] = "Fizz";
    for( i = 0; i < n; i +=  5 ) result[i] = "Buzz";
    for( i = 0; i < n; i += 15 ) result[i] = "FizzBuzz";

    result.shift();
    return result;
  },

/*******************************************************************************
*  using multiple while loops                                                  *
*******************************************************************************/
   n => {
    const result = Array( ++n );

    let i = 0; while ( ( i +=  1 ) < n ) result[i] = i;
        i = 0; while ( ( i +=  3 ) < n ) result[i] = "Fizz";
        i = 0; while ( ( i +=  5 ) < n ) result[i] = "Buzz";
        i = 0; while ( ( i += 15 ) < n ) result[i] = "FizzBuzz";

    result.shift();
    return result;
  },

/*******************************************************************************
*  using one for loop for each value                                           *
*******************************************************************************/
   n => {
    const result = [ ...Array( ++n ).keys() ];

    [ [  3, "Fizz"     ],
      [  5, "Buzz"     ],
      [ 15, "FizzBuzz" ],
    ].forEach( ([ num, str ]) => {
      for( let i = num; i < n; i += num ) result[i] = str;
    });

    result.shift();
    return result;
  },

/*******************************************************************************
*  using a nested ternary inside push                                          *
*******************************************************************************/
   n => {
    const result = [];

    for ( let i = 1; i <= n; i++ )
      result.push(
        i % 15 === 0 ? "FizzBuzz" :
        i %  3 === 0 ? "Fizz"     :
        i %  5 === 0 ? "Buzz"     :
        i
      );

    return result;
  },

/*******************************************************************************
*  adding two strings setting a default value                                  *
*******************************************************************************/
   n => {
    const result = [];

    for ( let i = 1; i <= n; i++ )
      result.push( 
        ( !( i % 3 ) ? "Fizz" : "" ) + 
        ( !( i % 5 ) ? "Buzz" : "" ) || i
      );

    return result;
  },

/*******************************************************************************
*  using map over the keys of an array                                         *
*******************************************************************************/
   n => [ ...Array( n ).keys() ].map( i =>
     ( ++i % 3 ? "" : "Fizz" ) + ( i % 5 ? "" : "Buzz" ) || i ),

/*******************************************************************************
*  using ternary                                                               *
*******************************************************************************/
   n => Array( n ).fill( 0 ).map( ( _, i ) =>
     ( ++i % 3 ? "" : "Fizz" ) + ( i % 5 ? "" : "Buzz" ) || i ),

/*******************************************************************************
*  using nested ternary                                                        *
*******************************************************************************/
   n => [ ...Array( n ).keys() ].map( i =>
     ( ++i % 15 ? i % 3 ? i % 5 ? "" : "Buzz" : "Fizz" : "FizzBuzz" ) || i ),

/*******************************************************************************
*  using reduce                                                                *
*******************************************************************************/
  n => [ ...Array( n ).keys() ].reduce( ( n, i ) =>
       [ ...n, ( ++i % 3 ? "" : "Fizz" ) + ( i % 5 ? "" : "Buzz" ) || i ],
       [] ),

/*******************************************************************************
*  recursive                                                                   *
*******************************************************************************/
  n => n ? [ ...fizzbuzz[11]( --n ), "Fizz".repeat(!( ++n % 3 )) +
           "Buzz".repeat(!( n % 5 )) || n ] : [],

/*******************************************************************************
*  using String.repeat()                                                       *
*******************************************************************************/
   n => [ ...Array( n ).keys() ].map( i =>
     "Fizz".repeat(!( ++i % 3 )) + "Buzz".repeat(!( i % 5 )) || i ),
];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [ [ 100 ], [
    1     , 2     , "Fizz"    , 4     , "Buzz", "Fizz"    ,
    7     , 8     , "Fizz"    , "Buzz", 11    , "Fizz"    ,
    13    , 14    , "FizzBuzz", 16    , 17    , "Fizz"    ,
    19    , "Buzz", "Fizz"    , 22    , 23    , "Fizz"    ,
    "Buzz", 26    , "Fizz"    , 28    , 29    , "FizzBuzz",
    31    , 32    , "Fizz"    , 34    , "Buzz", "Fizz"    ,
    37    , 38    , "Fizz"    , "Buzz", 41    , "Fizz"    ,
    43    , 44    , "FizzBuzz", 46    , 47    , "Fizz"    ,
    49    , "Buzz", "Fizz"    , 52    , 53    , "Fizz"    ,
    "Buzz", 56    , "Fizz"    , 58    , 59    , "FizzBuzz",
    61    , 62    , "Fizz"    , 64    , "Buzz", "Fizz"    ,
    67    , 68    , "Fizz"    , "Buzz", 71    , "Fizz"    ,
    73    , 74    , "FizzBuzz", 76    , 77    , "Fizz"    ,
    79    , "Buzz", "Fizz"    , 82    , 83    , "Fizz"    ,
    "Buzz", 86    , "Fizz"    , 88    , 89    , "FizzBuzz",
    91    , 92    , "Fizz"    , 94    , "Buzz", "Fizz"    ,
    97    , 98    , "Fizz"    , "Buzz",
  ]]
];

fizzbuzz.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.deepEqual( func( ...input ), expected )
));
