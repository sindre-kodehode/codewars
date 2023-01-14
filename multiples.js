#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  If we list all the natural numbers below 10 that are multiples of 3 or 5,   *
*  we get 3, 5, 6 and 9. The sum of these multiples is 23.                     *
*                                                                              *
*  Finish the solution so that it returns the sum of all the multiples of 3    *
*  or 5 below the number passed in. Additionally, if the number is negative,   *
*  return 0 (for languages that do have them).                                 *
*                                                                              *
*  Note: If the number is a multiple of both 3 and 5, only count it once.      *
*******************************************************************************/

const solution = [
/*******************************************************************************
*  for loop with if                                                            *
*******************************************************************************/
  ( n ) => {
    let sum = 0;

    for ( let i = 0; i < n; i++ )
      if ( i % 3 === 0 || i % 5 === 0 ) sum += i;
    
    return sum;
  },

/*******************************************************************************
*  for loop with ternary                                                       *
*******************************************************************************/
  ( n ) => {
    let sum = 0;

    for ( let i = 0; i < n; i++ )
      sum += i % 3 && i % 5 ? 0 : i;
    
    return sum;
  },

/*******************************************************************************
*  using a result array                                                        *
*******************************************************************************/
  ( n ) => {
    const result = new Array( Math.max( n, 0 ) ).fill( false );

    let i = 0, sum = 0;

    while ( ( i += 3 ) < n ) result[i] = true; i = 0;
    while ( ( i += 5 ) < n ) result[i] = true; i = 0;
    while ( ( i += 1 ) < n ) result[i] && ( sum += i );

    return sum;
  },

/*******************************************************************************
*  recursive                                                                   *
*******************************************************************************/
  ( n, i = n - 1 ) => {
    if ( i <= 0 ) return 0;
    if ( i % 3 && i % 5 ) return solution[3]( n, i - 1 );
    return solution[3]( n, i - 1 ) + i;
  },

/*******************************************************************************
*  using filter and reduce                                                     *
*******************************************************************************/
  ( n ) => [ ...Array( Math.max( n, 0) ).keys() ]
      .filter( i => !( i % 3 && i % 5 ) ).reduce( ( sum, i ) => sum + i, 0 )
  ,

/*******************************************************************************
*  single reduce                                                               *
*******************************************************************************/
  ( n ) => [ ...Array( Math.max( n, 0 ) ) ]
      .reduce( ( sum, _, i ) => sum += i % 3 && i % 5 ? 0 : i, 0 )
  ,

/*******************************************************************************
*  Mathematical solution                                                       *
*******************************************************************************/
  ( n ) => {
    n = Math.max( --n, 0 );
    const sum3  = Math.floor( n /  3 ) * (  3 + n - n %  3 ) / 2;
    const sum5  = Math.floor( n /  5 ) * (  5 + n - n %  5 ) / 2;
    const sum15 = Math.floor( n / 15 ) * ( 15 + n - n % 15 ) / 2;

    return sum3 + sum5 - sum15;
  },

];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [  10,   23 ],
  [  20,   78 ],
  [ 200, 9168 ],
  [  -1,    0 ],
  [   0,    0 ],
  [   1,    0 ],
  [   2,    0 ],
  [   3,    0 ],
  [   4,    3 ],
  [   5,    3 ],
  [   6,    8 ],
];

solution.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( input ), expected )
));
