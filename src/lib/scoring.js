export function getScoreboard(data) {
  const totals = Object.fromEntries(data.teams.map((team) => [team.id, 0]));
  for (const match of data.matches) {
    if (match.status !== "final") continue;
    totals[match.teamA] = (totals[match.teamA] ?? 0) + match.pointsA;
    totals[match.teamB] = (totals[match.teamB] ?? 0) + match.pointsB;
  }
  const [first, second] = data.teams;
  const firstTotal = totals[first.id] ?? 0;
  const secondTotal = totals[second.id] ?? 0;
  return { totals, leader: firstTotal === secondTotal ? null : firstTotal > secondTotal ? first.id : second.id, pointsAwarded: firstTotal + secondTotal, pointsRemaining: Math.max(0, data.totalPoints - firstTotal - secondTotal) };
}

export function getDayScore(data, dayId) {
  const totals = Object.fromEntries(data.teams.map((team) => [team.id, 0]));
  for (const match of data.matches) {
    if (match.dayId !== dayId || match.status !== "final") continue;
    totals[match.teamA] = (totals[match.teamA] ?? 0) + match.pointsA;
    totals[match.teamB] = (totals[match.teamB] ?? 0) + match.pointsB;
  }
  return totals;
}
