#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  Implement the function unique_in_order which takes as argument a            *
*  sequence and returns a list of items without any elements with the same     *
*  value next to each other and preserving the original order of elements.     *
*******************************************************************************/

const uniqueInOrder = [
/*******************************************************************************
*  using a for loop                                                            *
*******************************************************************************/
  A => {
    // store result in array
    const B = [];

    // loop with index
    for ( const [ i, a ] of [ ...A ].entries() )
      // add to result if different from previous value
      a !== A[ i + 1 ] && B.push( a );

    // return result array
    return B;
  },

/*******************************************************************************
*  using reduce                                                                *
*******************************************************************************/
  A => [ ...A ].reduce( ( B, a ) => a === B.at( -1 ) ? B : [ ...B, a ] , [] ),

/*******************************************************************************
*  using filter                                                                *
*******************************************************************************/
  A => [ ...A ].filter( ( e, i ) => e !== A[ i - 1 ] ),

];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [ ''               , []                             ],
  [ 'A'              , ['A']                          ],
  [ 'AA'             , ['A']                          ],
  [ 'AAAABBBCCDAABBB', ['A', 'B', 'C', 'D', 'A', 'B'] ],
  [ 'AADD'           , ['A','D']                      ],
  [ 'AAD'            , ['A','D']                      ],
  [ 'ADD'            , ['A','D']                      ],
  [ 'ABBCcAD'        , ['A', 'B', 'C', 'c', 'A', 'D'] ],
  [ [1,2,3,3]        , [1,2,3]                        ],
  [ ['a','b','b']    , ['a','b']                      ],
];

uniqueInOrder.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.deepEqual( func( input ), expected )
));
