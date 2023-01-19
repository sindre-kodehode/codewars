#! /usr/bin/env node
"use strict"
import assert from "node:assert"

//******************************************************************************
// Car Park Escape                                                             *
//                                                                             *
// Introduction                                                                *
// A multi-storey car park (also called a parking garage, parking structure,   *
// parking ramp, parkade, parking building, parking deck or indoor parking)    *
// is a building designed for car parking and where there are a number         *
// of floors or levels on which parking takes place. It is essentially         *
// an indoor, stacked car park. Parking structures may be heated if they       *
// are enclosed.                                                               *
//                                                                             *
// Design of parking structures can add considerable cost for planning new     *
// developments, and can be mandated by cities or states in new building       *
// parking requirements. Some cities such as London have abolished previously  *
// enacted minimum parking requirements (Source Wikipedia)                     *
//                                                                             *
// Task                                                                        *
// Your task is to escape from the carpark using only the staircases           *
// provided to reach the exit. You may not jump over the edge of the levels    *
// (you’re not Superman!) and the exit is always on the far right of the       *
// ground floor.                                                               *
//                                                                             *
// Rules                                                                       *
// 1. You are passed the carpark data as an argument into the function.        *
// 2. Free carparking spaces are represented by a 0                            *
// 3. Staircases are represented by a 1                                        *
// 4. Your parking place (start position) is represented by a 2 which          *
//    could be on any floor.                                                   *
// 5. The exit is always the far right element of the ground floor.            *
// 6. You must use the staircases to go down a level.                          *
// 7. You will never start on a staircase.                                     *
// 8. The start level may be any level of the car park.                        *
// 9. Each floor will have only one staircase apart from the ground floor      *
//    which will not have any staircases.                                      *
//                                                                             *
// Returns                                                                     *
// Return an array of the quickest route out of the carpark                    *
//                                                                             *
// R1 = Move Right one parking space.                                          *
// L1 = Move Left one parking space.                                           *
// D1 = Move Down one level.                                                   *
//                                                                             *
// Example                                                                     *
// Initialise                                                                  *
// carpark = [[1, 0, 0, 0, 2],                                                 *
//            [0, 0, 0, 0, 0]];                                                *
//                                                                             *
// Working Out                                                                 *
// - You start in the most far right position on level 1                       *
// - You have to move Left 4 places to reach the staircase => "L4"             *
// - You then go down one flight of stairs => "D1"                             *
// - To escape you have to move Right 4 places => "R4"                         *
//                                                                             *
// Result                                                                      *
// result = ["L4", "D1", "R4"]                                                 *
//******************************************************************************

const escape = [
  carpark => {
    const dirs = [];

    let i = carpark.findIndex(e => e.includes(2));
    let pos = carpark[i].indexOf(2);

    while (i < carpark.length) {
      const stair = carpark[i].includes(1)
        ? carpark[i].indexOf(1)
        : carpark[i].length - 1;

      const dir = stair - pos;
      pos = stair;

      dir > 0 && dirs.push(`R${dir}`);
      dir < 0 && dirs.push(`L${-dir}`);

      if (i++ >= carpark.length - 1) continue
      const down = +dirs.at(-1).match(/D(\d+)/)?.at(1);

      !dir && down
        ? dirs[dirs.length - 1] = `D${down + 1}`
        : dirs.push("D1");
    }

    return dirs;
  },

  carpark => carpark.reduce(({ pos, start, dirs }, floor, i) => {
    if (i < start) return { pos, start, dirs };
    if (i === start) pos = carpark[start].indexOf(2);

    const stair = floor.includes(1)
      ? floor.indexOf(1)
      : floor.length - 1;

    const dir = stair - pos
    pos = stair;

    dir > 0 && dirs.push(["R", dir]);
    dir < 0 && dirs.push(["L", -dir]);

    if (i >= carpark.length - 1) return { pos, start, dirs };

    !dir && dirs.at(-1)[0] === "D"
      ? dirs.at(-1)[1]++
      : dirs.push(["D", 1]);

    return { pos, start, dirs };
  }, {
    dirs: [],
    start: carpark.findIndex(e => e.includes(2)),
  })
    .dirs
    .map(e => e.join``),

];

//******************************************************************************
//  Tests                                                                      *
//******************************************************************************

const tests = [
  [
    [[0, 0, 0, 0, 0],
    [1, 0, 0, 0, 2],
    [0, 0, 0, 0, 0]],
    ["L4", "D1", "R4"],
  ], [
    [[2, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0]],
    ["R3", "D2", "R1"],
  ], [
    [[0, 2, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0]],
    ["R3", "D3"],
  ], [
    [[1, 0, 0, 0, 2],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]],
    ["L4", "D1", "R4", "D1", "L4", "D1", "R4"],
  ], [
    [[0, 0, 0, 0, 2]],
    [],
  ],
];

console.log("--- Running tests", "-".repeat(62));

for (const func of escape)
  for (const [input, expected] of tests)
    assert.deepEqual(func(input), expected);

console.log("--- Tests OK", "-".repeat(67));
