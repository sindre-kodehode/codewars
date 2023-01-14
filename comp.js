#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  Given two arrays a and b write a function comp(a, b) (orcompSame(a,         *
*  b)) that checks whether the two arrays have the "same" elements,            *
*  with the same multiplicities (the multiplicity of a member is the           *
*  number of times it appears). "Same" means, here, that the elements          *
*  in b are the elements in a squared, regardless of the order.                *
*******************************************************************************/

const comp = [
/*******************************************************************************
*  using a standard for loop                                                   *
*******************************************************************************/
  ( A, B ) => {
    if ( !A || !B )                      // if A or B is null or empty,
      return false;                      // return false

    A = A.map( e => e * e );             // square all elements

    A = A.sort();                        // sort ascending
    B = B.sort();

    for ( let i = 0; i < A.length; i++ ) // loop through all elements of A
      if ( A[i] !== B[i] )               // check if elements with same index 
        return false;                    // is the same, return false if not

    return true;                         // return true if A and B are the same
  },

/*******************************************************************************
*  using join                                                                  *
*******************************************************************************/
  ( A, B ) => {
    if ( !A || !B ) return false;

    A = A.map( e => e * e ).sort().join();
    B = B.sort().join();

    return A === B;
  },

  ( A, B ) => !!A && !!B && `${ A.map( e => e * e ).sort() }` === `${ B.sort() }`
  ,

/*******************************************************************************
*  using sort                                                                  *
*******************************************************************************/
  ( A, B ) => {
   if ( !A || !B ) return false;
  
    A = A.map( e => e * e ).sort();
    B.sort();

    return A.every( ( e, i ) => e === B[i] );
  },

  ( A, B ) => !!A && !!B && B.sort()
    && A.map( e => e * e ).sort().every( ( e, i ) => e === B[i] )
  ,
   
/*******************************************************************************
*  using splice                                                                *
*******************************************************************************/
  ( A, B ) => {
    if ( !A || !B ) return false;
    B = [ ...B ];

    for ( const a of A ) {
      if ( !B.includes( a * a ) ) return false;
      B.splice( B.indexOf( a * a ), 1 );
    }

    return true;
  },

  ( A, B ) => !!A && !!B &&
    A.every( a => B.includes( a * a ) && B.splice( B.indexOf( a * a ), 1 ) )
  ,
];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [[ [121, 144, 19, 161, 19, 144, 19, 11],
     [11*11, 121*121, 144*144, 19*19, 161*161, 19*19, 144*144, 19*19],
  ], true,
  ],
  [[ [121, 144, 19, 161, 19, 144, 19, 11],
     [11*21, 121*121, 144*144, 19*19, 161*161, 19*19, 144*144, 19*19],
  ], false,
  ],
  [[ [121, 144, 19, 161, 19, 144, 19, 11],
     [11*11, 121*121, 144*144, 190*190, 161*161, 19*19, 144*144, 19*19],
  ], false,
  ],
  [[ [2,1,3],
     [18,1,2],
  ], false,
  ],
  [[ [],
     [],
  ], true,
  ],
  [[ [],
     null,
  ], false,
  ],
  [[ [121, 144, 19, 161, 19, 144, 19, 11, 1008],
     [11*11, 121*121, 144*144, 190*190, 161*161, 19*19, 144*144, 19*19],
  ], false,
  ],
  [[ [10000000, 100000000],
     [10000000 * 10000000, 100000000 * 100000000],
  ], true,
  ],
  [[ [10000001, 100000000],
     [10000000 * 10000000, 100000000 * 100000000],
  ], false,
  ],
  [[ [2, 2, 3],
     [4, 9, 9],
  ], false,
  ],
  [[ [2, 2, 3],
     [4, 4, 9],
  ], true,
  ],
  [[ [4, 4],
     [1, 31],
  ], false,
  ],
  [[ [3, 4],
     [0, 25],
  ], false,
  ],
  [[ null,
     [],
  ], false,
  ],
  [[ [5, 3, 5, 5, 0, 1, 8, 5, 9, 3, 1, 4, 9, 5, 2, 6, 7, 10, 5, 4, 1, 0, 1, 9],
     [64, 36, 81, 0, 25, 81, 1, 1, 25, 16, 25, 49, 100, 4, 1, 25, 9, 16, 9, 25, 81, 1, 0, 25],
  ], true,
  ],
];

comp.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( ...input ), expected )
));
