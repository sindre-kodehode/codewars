#! /usr/bin/env node
"use strict"
import assert from "node:assert"

//******************************************************************************
// Tic Tac Toe Solver                                                          *
//                                                                             *
// If we were to set up a Tic-Tac-Toe game, we would want to know whether      *
// the board's current state is solved, wouldn't we? Our goal is to create     *
// a function that will check that for us!                                     *
//                                                                             *
// Assume that the board comes in the form of a 3x3 array, where the value     *
// is 0 if a spot is empty, 1 if it is an "X", or 2 if it is an "O", like so:  *
//                                                                             *
// [[0, 0, 1],                                                                 *
//  [0, 1, 2],                                                                 *
//  [2, 1, 0]]                                                                 *
//                                                                             *
// We want our function to return:                                             *
//                                                                             *
// -1 if the board is not yet finished AND no one has won yet (there are       *
// empty spots),                                                               *
// 1 if "X" won,                                                               *
// 2 if "O" won,                                                               *
// 0 if it's a cat's game (i.e. a draw).                                       *
//                                                                             *
// You may assume that the board passed in is valid in the context of a        *
// game of Tic-Tac-Toe.                                                        *
//******************************************************************************

const ticTacToeSolver = [
  board => {
    if (
      board[0][0] === 1 && board[1][0] === 1 && board[2][0] === 1 ||
      board[0][1] === 1 && board[1][1] === 1 && board[2][1] === 1 ||
      board[0][2] === 1 && board[1][2] === 1 && board[2][2] === 1 ||
      board[0][0] === 1 && board[0][1] === 1 && board[0][2] === 1 ||
      board[1][0] === 1 && board[1][1] === 1 && board[1][2] === 1 ||
      board[2][0] === 1 && board[2][1] === 1 && board[2][2] === 1 ||
      board[0][0] === 1 && board[1][1] === 1 && board[2][2] === 1 ||
      board[0][2] === 1 && board[1][1] === 1 && board[2][0] === 1)
      return 1;

    if (
      board[0][0] === 2 && board[1][0] === 2 && board[2][0] === 2 ||
      board[0][1] === 2 && board[1][1] === 2 && board[2][1] === 2 ||
      board[0][2] === 2 && board[1][2] === 2 && board[2][2] === 2 ||
      board[0][0] === 2 && board[0][1] === 2 && board[0][2] === 2 ||
      board[1][0] === 2 && board[1][1] === 2 && board[1][2] === 2 ||
      board[2][0] === 2 && board[2][1] === 2 && board[2][2] === 2 ||
      board[0][0] === 2 && board[1][1] === 2 && board[2][2] === 2 ||
      board[0][2] === 2 && board[1][1] === 2 && board[2][0] === 2)
      return 2;

    if (
      board[0][0] &&
      board[0][1] &&
      board[0][2] &&
      board[1][0] &&
      board[1][1] &&
      board[1][2] &&
      board[2][0] &&
      board[2][1] &&
      board[2][2])
      return 0;

    return -1;
  },

  board => {
    for (const p of [1, 2]) {
      for (const i of [0, 1, 2]) {
        if (
          board[0][i] === p && board[1][i] === p && board[2][i] === p ||
          board[i][0] === p && board[i][1] === p && board[i][2] === p)
          return p;
      }

      if (
        board[0][0] === p && board[1][1] === p && board[2][2] === p ||
        board[0][2] === p && board[1][1] === p && board[2][0] === p)
        return p;
    }

    for (const row of board)
      for (const column of row)
        if (!column) return -1;

    return 0;
  },

  board => {
    const rows = board;
    const cols = board
      .map((e, y) => e.map((_, x) =>
        board[e.length - 1 - x][y]));

    const lines = [
      ...rows,
      ...cols,
      rows.map((_, i) => rows[i][i]),
      cols.map((_, i) => cols[i][i]),
    ];

    for (const player of [1, 2])
      if (lines.some(line => line.every(e => e === player)))
        return player;

    return board
      .reduce((a, b) => [...a, ...b])
      .some(e => e === 0) ? -1 : 0;
  },

  board => {
    const b = board.map( e => e.join`` ).join` `;

    return /111|1..1..1|1...1...1|1....1....1/.test(b) ? 1 :
           /222|2..2..2|2...2...2|2....2....2/.test(b) ? 2 :
           /0/.test(b) ? -1 : 0;
  },
];


//******************************************************************************
//  Tests                                                                      *
//******************************************************************************
const tests = [
  [[
    [0, 0, 1],
    [0, 1, 2],
    [2, 1, 0]
  ], -1],

  [[
    [1, 1, 1],
    [0, 2, 0],
    [0, 0, 2]
  ], 1],
  [[
    [0, 1, 1],
    [2, 2, 2],
    [0, 0, 0]
  ], 2],
  [[
    [2, 0, 1],
    [0, 2, 1],
    [0, 0, 1]
  ], 1],
  [[
    [2, 1, 1],
    [0, 2, 1],
    [0, 0, 2]
  ], 2],
  [[
    [2, 0, 1],
    [0, 1, 0],
    [1, 0, 2]
  ], 1],
  [[
    [2, 0, 0],
    [0, 1, 2],
    [1, 0, 0]
  ], -1],
  [[
    [1, 2, 2],
    [2, 1, 1],
    [1, 1, 2]
  ], 0],
];

console.log("--- Running tests", "-".repeat(62));

for (const func of ticTacToeSolver)
  for (const [input, expected] of tests)
    assert.deepEqual(func(input), expected);

console.log("--- Tests OK", "-".repeat(67));
