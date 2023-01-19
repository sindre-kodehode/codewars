#! /usr/bin/env node
"use strict"
import assert from "node:assert"

//******************************************************************************
// Story                                                                       *
//                                                                             *
// Let's fast forward to the year 2048. Earth resources are scarcer then       *
// ever before. If humanity wants to survive, we need to migrate to outer      *
// space. UCA, a corporation specialised in planetary drilling, hired          *
// me to scout for a field expert. We have several forward bases on the        *
// Moon. Reconnaissance teams have recently reported promising locations for   *
// building settlements on the surface of the Moon. Our drills are already     *
// in place, but we need more data before we can give a go to start the        *
// drilling operation. This is where you, our field expert, come in ...        *
//                                                                             *
//                                                                             *
// Task                                                                        *
//                                                                             *
// "Given a satellite image of the surface of the Moon showing a possible      *
// location for building a settlement, with our drills already in place,       *
// calculate how long it will take to complete the drilling operation."        *
// Satellite image from archive:                                               *
//                                                                             *
// ´`:->>....xxxx..****..****..****.XX.                                        *
// ´`:===>...xxxx..****..****..****.@@.                                        *
// ´`:->>....xxxx..****..****..****.XX.                                        *
//                                                                             *
//                                                                             *
// Input                                                                       *
//                                                                             *
// canvas: a string, representing a satellite image of the surface of the      *
// Moon. The image is delimited by new line '\n' and all lines have the        *
// same length. Material visible on the image:                                 *
//                                                                             *
// drill components:                                                           *
//                                                                             *
// cabine: ´`:                                                                 *
// drill arm: - or =                                                           *
// drill head: >                                                               *
// surface:                                                                    *
// solid ground: .                                                             *
// soft rock: *                                                                *
// medium rock: x                                                              *
// hard rock: X                                                                *
// very hard rock: @                                                           *
//                                                                             *
//                                                                             *
// Output                                                                      *
//                                                                             *
// return a non-negative integer, representing the number of weeks it would    *
// take for our drills to excavate the entire area shown on the satellite      *
// image. An area is completely excavated if all rocks have been drilled.      *
//                                                                             *
//                                                                             *
// Surface                                                                     *
//                                                                             *
// each surface tile has a starting strength that corresponds to the default   *
// strength for its surface type drilling the tile decreases the strength by   *
// the drill's attack (more about that in section Drill) once the strength     *
// reaches 0, the tile is accessible for the drill to move to as long as       *
// the surface has a positive strength, it is not accessible to move to        *
// negative strength is not possible                                           *
//                                                                             *
// Surface Type      Char      Strength                                        *
//                                                                             *
// solid ground      '.'              0                                        *
// soft rock         '*'              1                                        *
// medium rock       'x'              2                                        *
// hard rock         'X'              3                                        *
// very hard rock    '@'              4                                        *
//                                                                             *
// Drill                                                                       *
//                                                                             *
// We distinguish between 2 types of drills, the drillatronino and the         *
// drillatron.                                                                 *
//                                                                             *
// drillatronino                                                               *
//                                                                             *
// the smallest drill, takes only 1 row                                        *
// starts with its cabin: ´`:                                                  *
// followed by a drill arm and drill head (example arm: --, example head: >>)  *
// the arm shows the power of the drill                                        *
// -: power = 1                                                                *
// =: power = 2                                                                *
// repetitions don't change the power, only the position of the drill          *
// at least one arm piece available                                            *
// the head shows the speed of the drill                                       *
// >: speed = 1                                                                *
// >>: speed = 2                                                               *
// >>>: speed = 3                                                              *
// no additional repetitions possible                                          *
// the damage the drill can do is calculated as follows:                       *
// attack drill = power * speed                                                *
// damage to surface = max(0, strength tile - attack drill)                    *
//                                                                             *
// Examples drillatronino                                                      *
//                                                                             *
// #1: regular                                                                 *
//                                                                             *
// on canvas            ´`:->                                                  *
// power                    1                                                  *
// speed                    1                                                  *
// attack                   1                                                  *
// example drilling    ´`:->@        (takes 4 cycles to escavate)              *
//                                                                             *
// - cycle 0: '@' strength = 4                                                 *
// - cycle 1: '@' strength = 3 (-1)                                            *
// - cycle 2: '@' strength = 2 (-1)                                            *
// - cycle 3: '@' strength = 1 (-1)                                            *
// - cycle 4: '@' strength = 0 (-1)                                            *
//                                                                             *
// #2: double speed                                                            *
//                                                                             *
// on canvas           ´`:->>                                                  *
// power                    1                                                  *
// speed                    2                                                  *
// attack                   2                                                  *
// example drilling   ´`:->>@        (takes 2 cycles to escavate)              *
//                                                                             *
// - cycle 0: '@' strength = 4                                                 *
// - cycle 1: '@' strength = 2 (-2)                                            *
// - cycle 2: '@' strength = 0 (-2)                                            *
//                                                                             *
// #3: double power                                                            *
//                                                                             *
// on canvas            ´`:=>                                                  *
// power                    2                                                  *
// speed                    1                                                  *
// attack                   2                                                  *
// example drilling    ´`:=>@        (takes 2 cycles to escavate)              *
//                                                                             *
// - cycle 0: '@' strength = 4                                                 *
// - cycle 1: '@' strength = 2 (-2)                                            *
// - cycle 2: '@' strength = 0 (-2)                                            *
//                                                                             *
// #4: triple speed                                                            *
//                                                                             *
// on canvas          ´`:->>>                                                  *
// power                    1                                                  *
// speed                    3                                                  *
// attack                   3                                                  *
// example drilling  ´`:->>>@        (takes 2 cycles to escavate)              *
//                                                                             *
// - cycle 0: '@' strength = 4                                                 *
// - cycle 1: '@' strength = 1 (-3)                                            *
// - cycle 2: '@' strength = 0 (-3, capped at 0)                               *
//                                                                             *
// #5: double speed, double power                                              *
//                                                                             *
// on canvas           ´`:=>>                                                  *
// power                    2                                                  *
// speed                    2                                                  *
// attack                   4                                                  *
// example drilling   ´`:=>>@        (takes 1 cycle to escavate)               *
//                                                                             *
// - cycle 0: '@' strength = 4                                                 *
// - cycle 1: '@' strength = 0 (-4)                                            *
//                                                                             *
// drillatron                                                                  *
//                                                                             *
// comprised of 2 or more drillatroninos                                       *
// each drillatronino has its own row, and own configuration of drill arm      *
// (type and size) and drill head                                              *
// no gaps in rows between drillatroninos                                      *
// moves as one part, meaning if any drillatronino is still drilling while     *
// others aren't, movement is postponed until that drillatronino has finished  *
//                                                                             *
// Examples drillatron                                                         *
//                                                                             *
// #1          #2          #3                                                  *
//                                                                             *
// ´`:->>>     ´`:==>>     ´`:==>>                                             *
// ´`:==>>     ´`:-->      ´`:==>>                                             *
// ´`:->>>     ´`:=>                                                           *
//             ´`:-->                                                          *
//             ´`:==>>                                                         *
//                                                                             *
//                                                                             *
// Drilling Cycle                                                              *
//                                                                             *
// a drilling cycle takes 1 week                                               *
// during a drilling cycle the following steps are executed in order:          *
// excavate surface                                                            *
// move (if possible) 1 tile from left to right                                *
// if no more rocks to be escavated, terminate; else, next cycle               *
//                                                                             *
//                                                                             *
// Examples                                                                    *
//                                                                             *
// #1: drillatronino drilling                                                  *
//                                                                             *
// canvas              ´`:->.x..                                               *
// cycles required     3                                                       *
//                                                                             *
// - cycle 1: nothing to drill, move to right                                  *
// - cycle 2: drill 'x', its strength decreases from 2 to 1                    *
// - cycle 3: drill 'x', its strength decreases from 1 to 0                    *
//                                                                             *
// #2: drillatron drilling                                                     *
//                                                                             *
// canvas              ´`:->X*..                                               *
//                     ´`:=>@x..                                               *
// cycles required     4                                                       *
// - cycle 1:                                                                  *
//   - drill 1: drill 'X', its strength decreases from 3 to 2                  *
//   - drill 2: drill '@', its strength decreases from 4 to 2                  *
// - cycle 2:                                                                  *
//   - drill 1: drill 'X', its strength decreases from 2 to 1                  *
//   - drill 2: drill '@', its strength decreases from 2 to 0                  *
// - cycle 3:                                                                  *
//   - drill 1: drill 'x', its strength decreases from 1 to 0                  *
//   - drill 2: wait for drill 1 to finish                                     *
//   - both drills are done -> move one step to the right                      *
// - cycle 4:                                                                  *
//   - drill 1: drill '*', its strength decreases from 1 to 0                  *
//   - drill 2: drill 'x', its strength decreases from 2 to 0                  *
//   - both drills are done -> all rocks have been drilled                     *
//                                                                             *
// .. much more examples available in Sample Tests                             *
//                                                                             *
//                                                                             *
// Canvas                                                                      *
//                                                                             *
// the canvas is a rectangular shape consisting of surface tiles and 1 big     *
// drillatron positioned at the left of the canvas the drillatron occupies     *
// the entire height of the canvas, and has a drillatronino attached on        *
// each row                                                                    *
//                                                                             *
// ´`:->>...xxx..XXx                                                           *
// ´`:-->...***..@@.                                                           *
// ´`:=>....***.....                                                           *
//                                                                             *
//                                                                             *
// Input Constraints                                                           *
//                                                                             *
// 50 tests with 1 <= drills <= 1 and 10 <= canvas width <= 20                 *
// 50 tests with 2 <= drills <= 3 and 10 <= canvas width <= 20                 *
// 50 tests with 2 <= drills <= 3 and 20 <= canvas width <= 50                 *
// 50 tests with 4 <= drills <= 8 and 10 <= canvas width <= 20                 *
// 50 tests with 4 <= drills <= 8 and 75 <= canvas width <= 95                 *
//                                                                             *
//******************************************************************************

const drill = [
  surface => surface
    .split`\n`
    .map(drill => {
      const [power, speed, surface] = drill
        .match(/´`:([-|=]+)(>+)(.*)/)
        .slice(1);

      const attack = speed.length * (/-/.test(power[0]) ? 1 : 2);
      const strength = [".", "*", "x", "X", "@"]
        .reduce((acc, e, i) => acc.set(e, i || 1), new Map());

      return surface
        .replace(/\.+$/, "")
        .split``
        .map(e => Math.ceil(strength.get(e) / attack))
    })
    .reduce((acc, b) => {
      b.forEach((e, i) => acc[i] = [...acc[i] || [], e]);
      return acc;
    }, [])
    .reduce((a, b) => a + Math.max(...b), 0),
];

//******************************************************************************
//  Tests                                                                      *
//******************************************************************************

const tests = [
  [[
    "´`:->...xxxx..****..****..****....",
    "´`:->...****..xxxx..****..****....",
    "´`:->...****..****..xxxx..****....",
    "´`:->...****..****..****..xxxx....",
  ].join`\n`, 41],
  [[
    "´`:========>>XXX**xx.....",
    "´`:->>>.xx.XX@@@@.***....",
    "´`:-->>...@@@..XXXX*****.",
    "´`:=>...xxX..@@.XXXXxxxxx",
  ].join`\n`, 32],
  [[
    "´`:->...",
  ].join("\n"), 0],
];

console.log("--- Running tests", "-".repeat(62));

for (const func of drill)
  for (const [input, expected] of tests)
    assert.deepEqual(func(input), expected);

console.log("--- Tests OK", "-".repeat(67));
