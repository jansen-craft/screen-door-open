import assert from "node:assert/strict";
import test from "node:test";
import { getDayScore, getScoreboard } from "../src/lib/scoring.js";

const base = { totalPoints: 12, teams: [{ id: "a" }, { id: "b" }], matches: [] };

test("does not award points for scheduled or in-progress matches", () => {
  const score = getScoreboard({ ...base, matches: [
    { dayId: "d2", teamA: "a", teamB: "b", status: "scheduled", pointsA: 1, pointsB: 0 },
    { dayId: "d2", teamA: "a", teamB: "b", status: "in_progress", pointsA: 1, pointsB: 0 },
  ] });
  assert.deepEqual(score.totals, { a: 0, b: 0 }); assert.equal(score.pointsRemaining, 12); assert.equal(score.leader, null);
});
test("adds final scores and supports split points", () => {
  const data = { ...base, matches: [
    { dayId: "d2", teamA: "a", teamB: "b", status: "final", pointsA: 1, pointsB: 0 },
    { dayId: "d3", teamA: "a", teamB: "b", status: "final", pointsA: .5, pointsB: .5 },
  ] };
  assert.deepEqual(getScoreboard(data).totals, { a: 1.5, b: .5 }); assert.equal(getScoreboard(data).leader, "a"); assert.deepEqual(getDayScore(data, "d3"), { a: .5, b: .5 });
});
test("recognizes a completed 12-point tournament", () => {
  const score = getScoreboard({ ...base, matches: [{ dayId: "d2", teamA: "a", teamB: "b", status: "final", pointsA: 7, pointsB: 5 }] });
  assert.equal(score.pointsAwarded, 12); assert.equal(score.pointsRemaining, 0);
});
