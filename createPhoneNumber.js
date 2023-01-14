#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  Write a function that accepts an array of 10 integers (between 0 and 9),    *
*  that returns a string of those numbers in the form of a phone number.       *
*                                                                              *
*  Example                                                                     *
*  createPhoneNumber([1,2,3,4,5,6,7,8,9,0]) => returns "(123) 456-7890"        *
*  The returned format must be correct in order to complete this challenge.    *
*                                                                              *
*  Don't forget the space after the closing parentheses!                       *
*******************************************************************************/

const createPhoneNumber = [
/*******************************************************************************
*  using slice and join in a template string                                   *
*******************************************************************************/
  n => {
    const first  = n.slice( 0,  3 ).join``;
    const second = n.slice( 3,  6 ).join``;
    const third  = n.slice( 6, 10 ).join``;

    return `(${ first }) ${ second }-${ third }`;
  },

/*******************************************************************************
*  using regex to separate the numbers                                         *
*******************************************************************************/
  n => {
    const re = /(\d{3,})(\d{3,})(\d{4,})/g;
    n = n.join``
    n = n.matchAll( re );
    n = [ ...n ][0];

    return `(${ n[1] }) ${ n[2] }-${ n[3] }`;
  },

/*******************************************************************************
*  using three while loops                                                     *
*******************************************************************************/
  n => {
    let i = 0;
    let res = "(";
    while ( i <  3 ) res += n[i++];

    res += ") ";
    while ( i <  6 ) res += n[i++];

    res += "-";
    while ( i < 10 ) res += n[i++];

    return res;
  },

/*******************************************************************************
*  using reduce                                                                *
*******************************************************************************/
  n => n.reduce( ( res, d ) => res.replace( "#", d ), "(###) ###-####"),

/*******************************************************************************
*  using regex                                                                 *
*******************************************************************************/
  n => n.join``.replace( /(...)(...)(.*)/, "($1) $2-$3" ),

/*******************************************************************************
*  using regex                                                                 *
*******************************************************************************/
  n => "(012) 345-6789".replace( /\d/g, d => n[d] ),

/*******************************************************************************
*  using regex                                                                 *
*******************************************************************************/
  n => "(###) ###-####".replace( /#/g, _ => n.shift() ),

];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [ [[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]], "(123) 456-7890" ],
  [ [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]], "(111) 111-1111" ],
  [ [[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]], "(123) 456-7890" ],
];

createPhoneNumber.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( ...input ), expected )
));