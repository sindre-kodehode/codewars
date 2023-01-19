#! /usr/bin/env node
"use strict"
import assert from "node:assert"

//******************************************************************************
// Create a class called Warrior which calculates and keeps track of their     *
// level and skills, and ranks them as the warrior they've proven to be.       *
//                                                                             *
//                                                                             *
// Business Rules:                                                             *
// A warrior starts at level 1 and can progress all the way to 100.            *
//                                                                             *
// A warrior starts at rank "Pushover" and can progress all the way to         *
// "Greatest".                                                                 *
//                                                                             *
// The only acceptable range of rank values is "Pushover", "Novice",           *
// "Fighter", "Warrior", "Veteran", "Sage", "Elite", "Conqueror", "Champion",  *
// "Master", "Greatest".                                                       *
//                                                                             *
// Warriors will compete in battles. Battles will always accept an enemy       *
// level to match against your own.                                            *
//                                                                             *
// With each battle successfully finished, your warrior's experience is        *
// updated based on the enemy's level.                                         *
//                                                                             *
// The experience earned from the battle is relative to what the warrior's     *
// current level is compared to the level of the enemy.                        *
//                                                                             *
// A warrior's experience starts from 100. Each time the warrior's experience  *
// increases by another 100, the warrior's level rises to the next level.      *
//                                                                             *
// A warrior's experience is cumulative, and does not reset with each rise     *
// of level. The only exception is when the warrior reaches level 100,         *
// with which the experience stops at 10000                                    *
//                                                                             *
// At every 10 levels, your warrior will reach a new rank tier. (ex. levels    *
// 1-9 falls within "Pushover" tier, levels 80-89 fall within "Champion"       *
// tier, etc.)                                                                 *
//                                                                             *
// A warrior cannot progress beyond level 100 and rank "Greatest".             *
//                                                                             *
//                                                                             *
// Battle Progress Rules & Calculations:                                       *
//                                                                             *
// If an enemy level does not fall in the range of 1 to 100, the battle        *
// cannot happen and should return "Invalid level".                            *
//                                                                             *
// Completing a battle against an enemy with the same level as your warrior    *
// will be worth 10 experience points.                                         *
//                                                                             *
// Completing a battle against an enemy who is one level lower than your       *
// warrior will be worth 5 experience points.                                  *
//                                                                             *
// Completing a battle against an enemy who is two levels lower or more        *
// than your warrior will give 0 experience points.                            *
//                                                                             *
// Completing a battle against an enemy who is one level higher or more        *
// than your warrior will accelarate your experience gaining. The greater      *
// the difference between levels, the more experience your warrior will        *
// gain. The formula is 20 * diff * diff where diff equals the difference      *
// in levels between the enemy and your warrior.                               *
//                                                                             *
// However, if your warrior is at least one rank lower than your enemy,        *
// and at least 5 levels lower, your warrior cannot fight against an enemy     *
// that strong and must instead return "You've been defeated".                 *
//                                                                             *
// Every successful battle will also return one of three responses: "Easy      *
// fight", "A good fight", "An intense fight". Return "Easy fight" if your     *
// warrior is 2 or more levels higher than your enemy's level. Return          *
// "A good fight" if your warrior is either 1 level higher or equal to         *
// your enemy's level. Return "An intense fight" if your warrior's level       *
// is lower than the enemy's level.                                            *
//                                                                             *
//                                                                             *
// Logic Examples:                                                             *
//                                                                             *
// If a warrior level 1 fights an enemy level 1, they will receive 10          *
// experience points.                                                          *
//                                                                             *
// If a warrior level 1 fights an enemy level 3, they will receive 80          *
// experience points.                                                          *
//                                                                             *
// If a warrior level 5 fights an enemy level 4, they will receive 5           *
// experience points.                                                          *
//                                                                             *
// If a warrior level 3 fights an enemy level 9, they will receive 720         *
// experience points, resulting in the warrior rising up by at least           *
// 7 levels.                                                                   *
//                                                                             *
// If a warrior level 8 fights an enemy level 13, they will receive            *
// 0 experience points and return "You've been defeated". (Remember,           *
// difference in rank & enemy level being 5 levels higher or more must be      *
// established for this.)                                                      *
//                                                                             *
// If a warrior level 6 fights an enemy level 2, they will receive 0           *
// experience points.                                                          *
//                                                                             *
//                                                                             *
// Training Rules & Calculations:                                              *
//                                                                             *
// In addition to earning experience point from battles, warriors can also     *
// gain experience points from training.                                       *
//                                                                             *
// Training will accept an array of three elements (except in java where       *
// you'll get 3 separated arguments): the description, the experience points   *
// your warrior earns, and the minimum level requirement.                      *
//                                                                             *
// If the warrior's level meets the minimum level requirement, the warrior     *
// will receive the experience points from it and store the description of     *
// the training. It should end up returning that description as well.          *
//                                                                             *
// If the warrior's level does not meet the minimum level requirement,         *
// the warrior doesn not receive the experience points and description and     *
// instead returns "Not strong enough", without any archiving of the result.   *
//                                                                             *
// Code Examples:                                                              *
//                                                                             *
// var bruce_lee = new Warrior();                                              *
// bruce_lee.level();        // => 1                                           *
// bruce_lee.experience();   // => 100                                         *
// bruce_lee.rank();         // => "Pushover"                                  *
// bruce_lee.achievements(); // => []                                          *
// bruce_lee.training(["Defeated Chuck Norris", 9000, 1]);                     *
// bruce_lee.experience();   // => 9100                                        *
// bruce_lee.level();        // => 91                                          *
// bruce_lee.rank();         // => "Master"                                    *
// bruce_lee.battle(90);     // => "A good fight"                              *
// bruce_lee.experience();   // => 9105                                        *
// bruce_lee.achievements(); // => ["Defeated Chuck Norris"]                   *
//******************************************************************************

class Warrior {
  #experience = 100;
  #achievements = [];
  #ranks = [
    "Pushover", "Novice", "Fighter", "Warrior",
    "Veteran", "Sage", "Elite", "Conqueror",
    "Champion", "Master", "Greatest",
  ];

  rank(level = this.level()) {
    return this.#ranks[Math.floor(level / 10)];
  }

  achievements() { return this.#achievements; }
  experience() { return this.#experience; }
  level() { return Math.floor(this.#experience / 100); }

  updateExp(exp) {
    this.#experience += exp;
    if (this.#experience > 10000) this.#experience = 10000;
  }

  battle(enemyLevel) {
    const warriorLevel = this.level();
    const enemyRank = Math.floor(enemyLevel / 10);
    const warriorRank = Math.floor(this.level() / 10);

    if (enemyLevel > 100 || enemyLevel < 1)
      return "Invalid level";

    if (enemyLevel === warriorLevel) {
      this.updateExp(10);
      return "A good fight";
    }

    if (enemyLevel === warriorLevel - 1) {
      this.updateExp(5);
      return "A good fight";
    }

    if (enemyLevel <= warriorLevel - 2)
      return "Easy fight";

    if (enemyRank > warriorRank && enemyLevel >= warriorLevel + 5)
      return "You've been defeated";

    const diff = enemyLevel - warriorLevel;
    this.updateExp(20 * diff * diff);

    return "An intense fight";
  }

  training([desc, exp, min]) {
    if (this.level() < min)
      return "Not strong enough";

    this.updateExp(exp);
    this.#achievements.push(desc);

    return desc;
  }
}

//******************************************************************************
//  Tests                                                                      *
//******************************************************************************

console.log("--- Running tests", "-".repeat(62));

const Goku = new Warrior();

assert.deepEqual(Goku.level(), 1);
assert.deepEqual(Goku.rank(), "Pushover");
assert.deepEqual(Goku.achievements(), []);
assert.deepEqual(Goku.training(["Do ten push-ups", 95, 1]), "Do ten push-ups");
assert.deepEqual(Goku.level(), 1);
assert.deepEqual(Goku.battle(0), "Invalid level");
assert.deepEqual(Goku.battle(1), "A good fight");
assert.deepEqual(Goku.level(), 2);
assert.deepEqual(Goku.achievements(), ["Do ten push-ups"]);
assert.deepEqual(Goku.rank(), "Pushover");
assert.deepEqual(Goku.battle(3), "An intense fight");
assert.deepEqual(Goku.level(), 2);
assert.deepEqual(Goku.training(["Survive one night at the Forest of Death", 170, 2]), "Survive one night at the Forest of Death");
assert.deepEqual(Goku.training(["Mastered the Spirit Bomb", 1580, 10]), "Not strong enough");
assert.deepEqual(Goku.achievements(), ["Do ten push-ups", "Survive one night at the Forest of Death"]);
assert.deepEqual(Goku.battle(2), "A good fight");
assert.deepEqual(Goku.level(), 4);
assert.deepEqual(Goku.experience(), 400);
assert.deepEqual(Goku.battle(9), "An intense fight");
assert.deepEqual(Goku.battle(14), "You've been defeated");
assert.deepEqual(Goku.level(), 9);
assert.deepEqual(Goku.battle(12), "An intense fight");
assert.deepEqual(Goku.battle(8), "Easy fight");
assert.deepEqual(Goku.rank(), "Novice");
assert.deepEqual(Goku.experience(), 1080);
assert.deepEqual(Goku.battle(140), "Invalid level");
assert.deepEqual(Goku.training(["Mastered the Spirit Bomb", 1580, 10]), "Mastered the Spirit Bomb");
assert.deepEqual(Goku.level(), 26);
assert.deepEqual(Goku.rank(), "Fighter");
assert.deepEqual(Goku.battle(30), "An intense fight");
assert.deepEqual(Goku.rank(), "Fighter");
assert.deepEqual(Goku.level(), 29);
assert.deepEqual(Goku.experience(), 2980);
assert.deepEqual(Goku.training(["Mastered the Shadow Clone Jutsu", 19, 6]), "Mastered the Shadow Clone Jutsu");
assert.deepEqual(Goku.experience(), 2999);
assert.deepEqual(Goku.level(), 29);
assert.deepEqual(Goku.battle(32), "An intense fight");
assert.deepEqual(Goku.rank(), "Warrior");
assert.deepEqual(Goku.experience(), 3179);
assert.deepEqual(Goku.battle(39), "An intense fight");
assert.deepEqual(Goku.rank(), "Veteran");
assert.deepEqual(Goku.experience(), 4459);
assert.deepEqual(Goku.level(), 44);
assert.deepEqual(Goku.training(["Defeat Superman", 10000, 100]), "Not strong enough");
assert.deepEqual(Goku.training(["Mastered the Spirit Gun", 1340, 43]), "Mastered the Spirit Gun");
assert.deepEqual(Goku.rank(), "Sage");
assert.deepEqual(Goku.experience(), 5799);
assert.deepEqual(Goku.level(), 57);
assert.deepEqual(Goku.battle(61), "An intense fight");
assert.deepEqual(Goku.rank(), "Elite");
assert.deepEqual(Goku.experience(), 6119);
assert.deepEqual(Goku.training(["Mastered the Perfect Roundhouse Kick", 1781, 60]), "Mastered the Perfect Roundhouse Kick");
assert.deepEqual(Goku.rank(), "Conqueror");
assert.deepEqual(Goku.experience(), 7900);
assert.deepEqual(Goku.battle(83), "An intense fight");
assert.deepEqual(Goku.level(), 82);
assert.deepEqual(Goku.rank(), "Champion");
assert.deepEqual(Goku.experience(), 8220);
assert.deepEqual(Goku.training(["Defeat The Four Horsemen", 1100, 82]), "Defeat The Four Horsemen");
assert.deepEqual(Goku.battle(100), "You've been defeated");
assert.deepEqual(Goku.rank(), "Master");
assert.deepEqual(Goku.level(), 93);
assert.deepEqual(Goku.experience(), 9320);
assert.deepEqual(Goku.training(["Win the Intergalaxtic Tournament", 679, 91]), "Win the Intergalaxtic Tournament");
assert.deepEqual(Goku.experience(), 9999);
assert.deepEqual(Goku.training(["Fight Superman to a draw", 11000, 99]), "Fight Superman to a draw");
assert.deepEqual(Goku.level(), 100);
assert.deepEqual(Goku.experience(), 10000);
assert.deepEqual(Goku.rank(), "Greatest");
assert.deepEqual(Goku.training(["Defeat Superman", 10000, 100]), "Defeat Superman");
assert.deepEqual(Goku.achievements(), ['Do ten push-ups', 'Survive one night at the Forest of Death', 'Mastered the Spirit Bomb', 'Mastered the Shadow Clone Jutsu', 'Mastered the Spirit Gun', 'Mastered the Perfect Roundhouse Kick', 'Defeat The Four Horsemen', 'Win the Intergalaxtic Tournament', 'Fight Superman to a draw', 'Defeat Superman']);

console.log("--- Tests OK", "-".repeat(67));
