#! /usr/bin/env node
"use strict"
import assert from "node:assert"

//******************************************************************************
// Snakes and Ladders                                                          *
//                                                                             *
// Introduction                                                                *
// Snakes and Ladders is an ancient Indian board game regarded today as        *
// a worldwide classic. It is played between two or more players on a          *
// gameboard having numbered, gridded squares. A number of "ladders" and       *
// "snakes" are pictured on the board, each connecting two specific board      *
// squares. (Source Wikipedia)                                                 *
//                                                                             *
// Task                                                                        *
// Your task is to make a simple class called SnakesLadders. The test cases    *
// will call the method play(die1, die2) independantly of the state of the     *
// game or the player turn. The variables die1 and die2 are the die thrown     *
// in a turn and are both integers between 1 and 6. The player will move       *
// the sum of die1 and die2.                                                   *
//                                                                             *
// Rules                                                                       *
// 1. There are two players and both start off the board on square 0.          *
//                                                                             *
// 2. Player 1 starts and alternates with player 2.                            *
//                                                                             *
// 3. You follow the numbers up the board in order 1=>100                      *
//                                                                             *
// 4. If the value of both die are the same then that player will have         *
//    another go.                                                              *
//                                                                             *
// 5. Climb up ladders. The ladders on the game board allow you to move        *
//    upwards and get ahead faster. If you land exactly on a square that       *
//    shows an image of the bottom of a ladder, then you may move the player   *
//    all the way up to the square at the top of the ladder. (even if you      *
//    roll a double).                                                          *
//                                                                             *
// 6. Slide down snakes. Snakes move you back on the board because you         *
//    have to slide down them. If you land exactly at the top of a snake,      *
//    slide move the player all the way to the square at the bottom of the     *
//    snake or chute. (even if you roll a double).                             *
//                                                                             *
// 7. Land exactly on the last square to win. The first person to reach        *
//    the highest square on the board wins. But there's a twist! If you        *
//    roll too high, your player "bounces" off the last square and moves       *
//    back. You can only win by rolling the exact number needed to land on     *
//    the last square. For example, if you are on square 98 and roll a five,   *
//    move your game piece to 100 (two moves), then "bounce" back to 99,       *
//    98, 97 (three, four then five moves.)                                    *
//                                                                             *
// 8. If the Player rolled a double and lands on the finish square             *
//    “100” without any remaining moves then the Player wins the game          *
//    and does not have to roll again.                                         *
//                                                                             *
// Returns                                                                     *
// Return Player n Wins!. Where n is winning player that has landed on         *
// square 100 without any remainding moves left.                               *
//                                                                             *
// Return Game over! if a player has won and another player tries to play.     *
//                                                                             *
// Otherwise return Player n is on square x. Where n is the current player     *
// and x is the sqaure they are currently on.                                  *
//******************************************************************************

class SnakesLadders {
  constructor( start1=0, start2=0 ) {
    this.gameOver = false;
    this.players = [{ x: start1 }, { x: start2 }];
    this.player = 0;
    this.board = [
      0, 1, 38, 3, 4, 5, 6, 14, 31, 9, 10,
      11, 12, 13, 14, 26, 6, 17, 18, 19, 20,
      42, 22, 23, 24, 25, 26, 27, 84, 29, 30,
      31, 32, 33, 34, 35, 44, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 25, 47, 48, 11, 50,
      67, 52, 53, 54, 55, 56, 57, 58, 59, 60,
      61, 19, 63, 60, 65, 66, 67, 68, 69, 70,
      91, 72, 73, 53, 75, 76, 77, 98, 79, 80,
      81, 82, 83, 84, 85, 86, 94, 88, 68, 90,
      91, 88, 93, 94, 75, 96, 97, 98, 80, 100,
    ];
  }

  play(die1, die2) {
    if ( this.gameOver ) return "Game over!";

    const sum = die1 + die2;
    let n = this.player;

    let pos = this.players[n].x + sum;

    if (pos === 100) {
      this.gameOver = true;
      return `Player ${n + 1} Wins!`;
    }

    if (pos > 100) pos = 200 - pos;

    this.players[n].x = this.board[pos];

    const text = `Player ${n + 1} is on square ${this.players[n].x}`;

    if (die1 !== die2) this.player = (n + 1) % 2;

    return text;
  }
}


//******************************************************************************
//  Tests                                                                      *
//******************************************************************************

console.log("--- Running tests", "-".repeat(62));

const game = new SnakesLadders( 98 );

assert.equal(game.play(4, 3), "Player 1 is on square 75");

// assert.equal(game.play(1, 1), "Player 1 is on square 38");
// assert.equal(game.play(1, 5), "Player 1 is on square 44");
// assert.equal(game.play(6, 2), "Player 2 is on square 31");
// assert.equal(game.play(1, 1), "Player 1 is on square 25");

console.log("--- Tests OK", "-".repeat(67));
