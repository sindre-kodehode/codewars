#! /usr/bin/env node
"use strict"
import assert from "node:assert"

/*******************************************************************************
*  In this kata you have to create all permutations of a non empty input       *
*  string and remove duplicates, if present. This means, you have to shuffle   *
*  all letters from the input in all possible orders.                          *
*                                                                              *
*  Examples:                                                                   *
*  With input 'a'                                                              *
*  Your function should return: ['a']                                          *
*  With input 'ab'                                                             *
*  Your function should return ['ab', 'ba']                                    *
*  With input 'aabb'                                                           *
*  Your function should return ['aabb', 'abab', 'abba', 'baab', 'baba',        *
*  'bbaa']                                                                     *
*  The order of the permutations doesn't matter.                               *
*******************************************************************************/

const permutations = [
/*******************************************************************************
*  add random elements                                                         *
*******************************************************************************/
  ( A ) => {
    // helper function for finding the factorial
    const fac = n => n ? n * fac( --n ) : 1;

    // make an object containing the frequency of each element
    const freqs = [ ...A ]
      .reduce( ( freqs, a ) => ({ ...freqs, [a] : freqs[a] + 1 || 1 }), {} );

    // divide the length of the string factorial divided by
    // frequency of all elements factorial
    const n = Object.values( freqs )
      .reduce( ( n, a ) => n / fac( a ), fac( A.length ) );

    // a set to store only unique permutations
    const B = new Set();

    // loop until all unique permutations have been found
    while ( B.size < n )
      B.add( [ ...A ].sort( _ => Math.random() - 0.5 ).join`` );
    
    // return array of strings
    return [ ...B ];
  },

/*******************************************************************************
*  find all the permutations for n - 1, then copy them n times and insert      *
*  the next character in between the others, in all the places                 *
*******************************************************************************/
  ( A ) => {
    let B = [ "" ];

    // loop over each character in str
    [ ...A ].forEach( ( a, i ) =>

      // copy previous array i + 1 times
      B = Array( ++i ).fill( [ ...B ] ).flat().sort()

      // for each splice next char in between the others i times
      .map( ( b, j ) => b.slice( 0, j % i ) + a + b.slice( j % i )
    ));

    // return only unique permutations
    return [ ...new Set( B ) ];
  },

/*******************************************************************************
*  using lexicographical ordering                                              *
*******************************************************************************/
  ( A ) => {
    const B = [];

    // sort elements to find lexicographically minimal permutation
    let a = [ ...A ].sort();

    while ( true ) {
      // add current permutation as a string to result
      B.push( a.join`` );

      // Find the largest index k such that a[k] < a[ k + 1 ]
      const k = a.findLastIndex( ( _, k ) => a[k] < a[ k + 1 ] );

      // If no such index exists, the permutation is the last permutation
      if ( k === -1 ) break;

      // Find the largest index l greater than k such that a[k] < a[l]
      const l = a.findLastIndex( ( _, l ) => a[k] < a[l] );

      // Swap the value of a[k] with that of a[l]
      [ a[k], a[l] ] = [ a[l], a[k] ];

      // Reverse the sequence from a[ k + 1 ] up to and including the final
      // element
      a = [ ...a.slice( 0, k + 1 ), ...a.slice( k + 1 ).reverse() ];
    }

    return B;
  },

/*******************************************************************************
*  using Heap's algorithm ( recursive )                                        *
*******************************************************************************/
  ( A, B = [], a = [ ...A ], k = a.length ) => {
    if ( !--k ) {
      B.push( a.join`` );
      return B;
    }

    // generate permutations with k-th unaltered
    permutations[3]( A, B, a, k );

    // generate permutations for k-th swapped with each k-1 initial
    for ( let i = 0; i < k; i++ ) {

      // swap choice dependent on parity of k (even or odd)
      const l = ( k + 1 ) % 2 ? 0 : i;
      [ a[l], a[k] ] = [ a[k], a[l] ];

      // generate permutations with k-th altered
      permutations[3]( A, B, a, k );
    }

    // filter unique
    return [ ...new Set( B ) ];
  },

/*******************************************************************************
*  using Heap's algorithm ( for loop )                                         *
*******************************************************************************/
  ( A ) => {
    const a = [ ...A ];
    const B = [];
    let n   = A.length;

    // c is an encoding of the stack state.
    let c = Array( n ).fill( 0 );

    B.push( a.join`` );
    
    // i acts similarly to a stack pointer
    for ( let i = 1; i < n; i++ ) {
      if ( c[i] < i ) {
        // swap choice dependent on parity of k (even or odd)
        const l = i % 2 ? c[i] : 0;
        [ a[l], a[i] ] = [ a[i], a[l] ];

        // swap has occurred, ending the for-loop. simulate the
        // increment of the for-loop counter
        B.push( a.join`` );
        c[i]++

        // simulate recursive call reaching the base case by bringing
        // the pointer to the base case analog in the array
        i = 0;

      } else {
        // reset the state and simulate popping the stack by incrementing
        // the pointer.
        c[i] = 0;
      }
    }

    // filter unique
    return [ ...new Set( B ) ];
  },

/*******************************************************************************
*  using a tree structure                                                      *
*******************************************************************************/
  ( str ) => {
    class Permutations extends Set {
      constructor( pool, parent, value, root ) {
        super();
        this.pool   = [ ...pool ];
        this.parent = parent;
        this.value  = value;
        this.root   = root || this;

        // use pool to add children recursively 
        this.pool.forEach( ( value, i ) => {
          const newPool = this.pool.filter( ( _, j ) => j - i );
          new Permutations( newPool, this, value, this.root );
        });

        // check if leaf node
        if ( !this.pool.length ) {
          let result  = this.value ?? "";
          let current = this;

          // walk back to root, collecting values
          while ( current = current.parent )
            result += current.value ?? "";

          this.root.add( result );
        } 
      };
    };

    return [ ...new Permutations( str ) ];
  },

];

/*******************************************************************************
*  tests                                                                       *
*******************************************************************************/
const abcd = [
  'abcd', 'abdc', 'acbd', 'acdb', 'adbc', 'adcb', 'bacd', 'badc', 'bcad',
  'bcda', 'bdac', 'bdca', 'cabd', 'cadb', 'cbad', 'cbda', 'cdab', 'cdba',
  'dabc', 'dacb', 'dbac', 'dbca', 'dcab', 'dcba'
];

const tests = [
  [     'a', [ 'a' ]                                            ],
  [    'ab', [ 'ab', 'ba' ]                                     ],
  [   'abc', [ 'abc', 'acb', 'bac', 'bca', 'cab', 'cba' ]       ],

  [  'abcd', abcd                                               ],
  [  'bcad', abcd                                               ],
  [  'dcba', abcd                                               ],

  [    'aa', [ 'aa' ]                                           ],
  [  'aabb', [ 'aabb', 'abab', 'abba', 'baab', 'baba', 'bbaa' ] ],
  [ 'aaaab', [ 'aaaab', 'aaaba', 'aabaa', 'abaaa', 'baaaa' ]    ],
];

permutations.forEach( func =>
  tests.forEach( ([ input, expected ]) =>
    assert.deepEqual( func( input ).sort(), expected.sort() )
));
