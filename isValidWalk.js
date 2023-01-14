#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  You live in the city of Cartesia where all roads are laid out in a          *
*  perfect grid. You arrived ten minutes too early to an appointment,          *
*  so you decided to take the opportunity to go for a short walk. The          *
*  city provides its citizens with a Walk Generating App on their phones       *
*  -- everytime you press the button it sends you an array of one-letter       *
*  strings representing directions to walk (eg. ['n', 's', 'w', 'e']). You     *
*  always walk only a single block for each letter (direction) and you         *
*  know it takes you one minute to traverse one city block, so create a        *
*  function that will return true if the walk the app gives you will take      *
*  you exactly ten minutes (you don't want to be early or late!) and will,     *
*  of course, return you to your starting point. Return false otherwise.       *
*                                                                              *
*  Note: you will always receive a valid array containing a random assortment  *
*  of direction letters ('n', 's', 'e', or 'w' only). It will never give       *
*  you an empty array (that's not a walk, that's standing still!).             *
*******************************************************************************/

const isValidWalk = [
/*******************************************************************************
*  using forEach                                                               *
*******************************************************************************/
  ( walk ) => {
    // if walk doesn't take ten minutes return false
    if ( walk.length !== 10 ) return false;

    // set coordinates to 0,0
    let x = 0, y = 0;

    // check each direction in array
    for ( const step of walk )
      switch ( step ) {
        // if north/south, increase/decrease y coordinate
        case "n" : y++; break;
        case "s" : y--; break;

        // if east/west, increase/decrease x coordinate
        case "e" : x++; break;
        case "w" : x--; break;
     }

    // return if x and y equals 0 or not
    return !x && !y;
  },

/*******************************************************************************
*  using filter                                                                *
*******************************************************************************/
  ( walk ) => {
    const n = walk.filter( e => e === "n" ).length;
    const s = walk.filter( e => e === "s" ).length;
    const e = walk.filter( e => e === "e" ).length;
    const w = walk.filter( e => e === "w" ).length;

    return n === s && e === w && walk.length === 10;
  },

/*******************************************************************************
*  adding a count prototype function to array                                  *
*******************************************************************************/
  ( walk ) => {
    Array.prototype.count = function( step ) {
      return this.filter( dir => dir === step ).length;
    };

    return walk.count( "n" ) === walk.count( "s" )
        && walk.count( "e" ) === walk.count( "w" )
        && walk.length === 10
  },

/*******************************************************************************
*  storing directions in an object                                             *
*******************************************************************************/
  ( walk ) => {
    const step = { n : 0, s : 0, e : 0, w : 0 };
    walk.forEach( d => step[d]++ );

    return step.n === step.s && step.e === step.w && walk.length === 10;
  },

/*******************************************************************************
*  using matchAll                                                              *
*******************************************************************************/
  ( walk ) => {
    walk = walk.join``;

    const n = ( walk.match( /n/g ) || "" ).length;
    const s = ( walk.match( /s/g ) || "" ).length;
    const e = ( walk.match( /e/g ) || "" ).length;
    const w = ( walk.match( /w/g ) || "" ).length;

    return n === s && e === w && walk.length === 10;
  },

/*******************************************************************************
*  using regex groups                                                          *
*******************************************************************************/
  ( walk ) => {
    const { 
      n : { length : n },
      s : { length : s },
      e : { length : e },
      w : { length : w },
    } = walk.sort().join``.match( /(?<e>e*)(?<n>n*)(?<s>s*)(?<w>w*)/ ).groups;

    return n === s && e === w && walk.length === 10;
  },

/*******************************************************************************
*  using reduce                                                                *
*******************************************************************************/
  ( walk ) => {
    const dir = walk.reduce( ( res, direction ) =>
      ({ ...res, [ direction ]: res[ direction ] + 1, })
    , { n : 0, s : 0, e : 0, w : 0 } );

    return dir.n === dir.s && dir.e === dir.w && walk.length === 10;
  },

/*******************************************************************************
*  reduce one-liner                                                            *
*******************************************************************************/
  ( walk ) => walk.length == 10 && !walk.reduce( ( res, step ) =>
      res + { "n" : -1, "s" : 1, "e" : 2, "w" : -2 }[ step ], 0
  ),

];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const tests = [
  [ ["n"                                                             ], false ],
  [ ["n","s"                                                         ], false ],
  [ ["n","s","n","s","n","s","n","s","n","s","n","s"                 ], false ],
  [ ["n","s","e","w","n","s","e","w","n","s","e","w","n","s","e","w" ], false ],
  [ ["n","s","n","s","n","s","n","s","n","n"                         ], false ],
  [ ["e","e","e","w","n","s","n","s","e","w"                         ], false ],
  [ ["n","e","n","e","n","e","n","e","n","e"                         ], false ],
  [ ["n","w","n","w","n","w","n","w","n","w"                         ], false ],
  [ ["e","s","e","s","e","s","e","s","e","s"                         ], false ],
  [ ["w","s","w","s","w","s","w","s","w","s"                         ], false ],
  [ ["n","s","n","s","n","s","n","s","n","s"                         ], true  ],
  [ ["e","w","e","w","n","s","n","s","e","w"                         ], true  ],
  [ ["n","s","e","w","n","s","e","w","n","s"                         ], true  ],
  [ ["n","n","n","s","s","s","e","w","n","s"                         ], true  ],
];

isValidWalk.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.strictEqual( func( input ), expected )
));
