#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  Pete likes to bake some cakes. He has some recipes and                      *
*  ingredients. Unfortunately he is not good in maths. Can you help            *
*  him to find out, how many cakes he could bake considering his               *
*  recipes? Write a function cakes(), which takes the recipe (object)          *
*  and the available ingredients (also an object) and returns the maximum      *
*  number of cakes Pete can bake (integer). For simplicity there are           *
*  no units for the amounts (e.g. 1 lb of flour or 200 g of sugar are          *
*  simply 1 or 200). Ingredients that are not present in the objects,          *
*  can be considered as 0.                                                     *
*******************************************************************************/

const cakes = [
/*******************************************************************************
*  using for...in loop                                                         *
*******************************************************************************/
  ( recipe, available ) => {
    let result;
    
    // loop through all ingredients in recipe
    for ( const ingredient in recipe ) {
      
      // if ingredient is not avaialble, return 0
      if ( !available[ ingredient ] ) return 0;
      
      // calculate ratio of available and needed
      let ratio = available[ ingredient ] / recipe[ ingredient ];
      
      // round down to nearest integer
      ratio = Math.floor( ratio );
      
      // if not enough, return 0
      if ( ratio === 0 ) return 0;
      
      // first time, set result to ratio
      else if ( result === undefined ) result = ratio;
      
      // set result to ratio if ratio is lower
      else if ( ratio < result ) result = ratio;
    }
    
    // Pete can bake (result) amount of cakes
    return result;
  },

/*******************************************************************************
*  using Math.min                                                              *
*******************************************************************************/
  ( A, B ) => {
    let res = Infinity;
    
    for ( const a in A )
      res = Math.min( res, Math.floor( B[a] / A[a] ) || 0 );
    
    return res;
  },

/*******************************************************************************
*  using reduce                                                                *
*******************************************************************************/
  ( A, B ) => Object.keys( A ).reduce( ( res, a ) =>
      Math.min( res, Math.floor( B[a] / A[a] ) || 0 ), Infinity )
  ,

/*******************************************************************************
*  using bitshift to round down                                                *
*******************************************************************************/
  ( A, B ) => {
    const res = [];

    for ( const key in A ) 
      res.push( B[key] / A[key] >> 0 );

    return Math.min( ...res );
  },

  ( A, B ) => Math.min( ...Object.keys(A).map( a => B[a] / A[a] >> 0 ) )
  ,
];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [[
    { flour :  500, sugar :  200, eggs : 1             },
    { flour : 1200, sugar : 1200, eggs : 5, milk : 200 },
  ], 2,
  ],
  [[    
    { cream :  200, flour :   300, sugar :   150, milk :   100, oil   :  100 },
    { sugar : 1700, flour : 20000, milk  : 20000, oil  : 30000, cream : 5000 },
  ], 11,
  ],
  [[
    { apples :   3, flour :  300, sugar :  150, milk : 100, oil : 100 },
    { sugar  : 500, flour : 2000, milk  : 2000                        },
  ], 0,
  ],
  [[
    { apples :   3, flour :  300, sugar :  150, milk   : 100, oil : 100 },
    { sugar  : 500, flour : 2000, milk  : 2000, apples :  15, oil : 20  },
  ], 0,
  ],
  [[
    { eggs : 4, flour : 400 },
    {                       },
  ], 0,
  ],
  [[
    { cream : 1, flour : 3, sugar : 1, milk : 1, oil : 1, eggs : 1 },
    { cream : 1, flour : 3, sugar : 1, milk : 1, oil : 1, eggs : 1 },
  ], 1,
  ],
];

cakes.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( ...input ), expected )
));
