const test = require("node:test");
const assert = require("node:assert/strict");

const {
  calculateKD,
  calculateWinRate,
  calculateHeadshotPercentage,
  calculateFirstDeathRatio,
  clamp,
} = require("./calculations");

test("calculateKD divides kills by deaths", () => {
  assert.equal(calculateKD(10, 5), 2);
});

test("calculateKD does not divide by zero", () => {
  assert.equal(calculateKD(10, 0), 10);
  assert.equal(Number.isFinite(calculateKD(10, 0)), true);
});

test("calculateWinRate returns a percentage", () => {
  assert.equal(calculateWinRate(8, 20), 40);
});

test("calculateWinRate handles zero games without NaN", () => {
  assert.equal(calculateWinRate(0, 0), 0);
});

test("calculateHeadshotPercentage handles zero kills", () => {
  assert.equal(calculateHeadshotPercentage(5, 0), 0);
});

test("calculateFirstDeathRatio uses max(firstKills, 1)", () => {
  assert.equal(calculateFirstDeathRatio(40, 20), 2);
  assert.equal(calculateFirstDeathRatio(5, 0), 5);
});

test("clamp bounds values", () => {
  assert.equal(clamp(150, 0, 100), 100);
  assert.equal(clamp(-10, 0, 100), 0);
  assert.equal(clamp(50, 0, 100), 50);
});
