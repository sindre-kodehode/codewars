#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  A child is playing with a ball on the nth floor of a tall building. The     * 
*  height of this floor, h, is known.                                          * 
*                                                                              * 
*  He drops the ball out of the window. The ball bounces (for example),        * 
*  to two-thirds of its height (a bounce of 0.66).                             * 
*                                                                              * 
*  His mother looks out of a window 1.5 meters from the ground.                * 
*                                                                              * 
*  How many times will the mother see the ball pass in front of her window     * 
*  (including when it's falling and bouncing?                                  * 
*                                                                              * 
*  Three conditions must be met for a valid experiment:                        * 
*  Float parameter "h" in meters must be greater than 0                        * 
*  Float parameter "bounce" must be greater than 0 and less than 1             * 
*  Float parameter "window" must be less than h.                               * 
*                                                                              * 
*  If all three conditions above are fulfilled, return a positive integer,     * 
*  otherwise return -1.                                                        * 
*                                                                              * 
*  Note: The ball can only be seen if the height of the rebounding ball        * 
*  is strictly greater than the window parameter.                              * 
*                                                                              * 
*  Examples:                                                                   * 
*  - h = 3, bounce = 0.66, window = 1.5, result is  3                          * 
*  - h = 3, bounce = 1.00, window = 1.5, result is -1                          * 
*                                                                              * 
*  (Condition 2) not fulfilled).                                               * 
*******************************************************************************/

const bouncingBall = [
/*******************************************************************************
*  using while true loop                                                       *
*******************************************************************************/
  ( h, b, w ) => {
    // guard clauses
    if ( h <= 0 ) return -1;
    if ( b <= 0 ) return -1;
    if ( b >= 1 ) return -1;
    if ( w >= h ) return -1;

    // store number of bounces, goes past window one time on it's way down
    let n = 1;
  
    // infinite loop
    while ( true ) {

      // update height of ball
      h *= b;

      // ball goes past window two times
      if ( h > w ) n += 2;

      // ball does not reach window, stop loop
      else break;
    }

    // return number of bounces
    return n;
  },

/*******************************************************************************
*  more condenced                                                              *
*******************************************************************************/
  ( h, b, w ) => {
    if ( b <= 0 || b >= 1 || w >= h ) return -1;

    let n = 0;
    while ( ( h *= b ) > w ) n++;

    return ( n * 2 ) + 1;
  },

/*******************************************************************************
*  start at -1                                                                 *
*******************************************************************************/
  ( h, b, w ) => {
    if ( b <= 0 || b >= 1 ) return -1;

    let n = -1;
    while ( h > w ) n += 2, h *= b;
    return n;
  },

/*******************************************************************************
*  recursive                                                                   *
*******************************************************************************/
  ( h, b, w ) =>
    ( b > 0 && b < 1 && w < h ) ? bouncingBall[3]( h * b, b, w ) + 2 : -1,

/*******************************************************************************
*  calculate bounces using the formula for geometric series                    *
*  a[n] = a * r ^ ( n - 1 ) => n = log( a[n] / a ) / log( r )                  *
*******************************************************************************/
  ( h, b, w, M = Math ) =>
    M.max( M.ceil( M.log( w / h ) / M.log( b ) ) * 2 - 1 || -1, -1 ),

];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [ [ 10,  0.60, 10.0 ], -1 ],
  [ [  2,  0.50,  1.0 ],  1 ],
  [ [ 30,  0.40, 10.0 ],  3 ],
  [ [ 30,  0.66,  1.5 ], 15 ],
  [ [ 30,  0.75,  1.5 ], 21 ],
  [ [  3,  0.66,  1.5 ],  3 ],
  [ [ 40,  0.40, 10.0 ],  3 ],
  [ [ 40,  1.00, 10.0 ], -1 ],
  [ [  4,  0.25,  1.0 ],  1 ],
  [ [ -5,  0.66,  1.5 ], -1 ],
  [ [  5, -1.00,  1.5 ], -1 ],
];

bouncingBall.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( ...input ), expected )
));
