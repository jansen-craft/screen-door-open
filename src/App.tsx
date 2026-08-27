import { exampleTrip, showExampleResults, trip, type Team } from "./data/trip";
import { getDayScore, getScoreboard } from "./lib/scoring";

const activeTrip = showExampleResults ? exampleTrip : trip;
const scoreboard = getScoreboard(activeTrip);
const [teamA, teamB] = activeTrip.teams;

function playerNames(ids: string[]) {
  return ids.map((id) => activeTrip.players.find((player) => player.id === id)?.firstName ?? id).join(" & ");
}

function TeamMark({ team, compact = false }: { team: Team; compact?: boolean }) {
  return <span className={compact ? "team-mark compact" : "team-mark"} style={{ "--team-color": team.color } as React.CSSProperties}>{team.name}</span>;
}

export default function App() {
  const leader = scoreboard.leader ? activeTrip.teams.find((team) => team.id === scoreboard.leader) : null;
  return <main>
    <section className="hero" aria-labelledby="site-title">
      <div className="hero-grain" />
      <nav aria-label="Page sections"><a href="#scoreboard">Scoreboard</a><a href="#itinerary">Itinerary</a><a href="#results">Results</a></nav>
      <div className="eyebrow">Northern Michigan · 2026</div>
      <h1 id="site-title">Screen Door<br /><em>Open.</em></h1>
      <p className="hero-subtitle">{activeTrip.dates} · A four-day match for the cup.</p>
      <a className="scroll-cue" href="#scoreboard">Follow the score <span aria-hidden="true">↓</span></a>
    </section>

    <section id="scoreboard" className="scoreboard section-shell" aria-labelledby="scoreboard-title">
      <div className="section-label">The Scorecard</div>
      <div className="scoreboard-heading"><h2 id="scoreboard-title">Race to 12</h2><p>{leader ? `${leader.name} leads the way.` : "The cup is still level."}</p></div>
      <div className="score-card">
        <div className="score-team"><TeamMark team={teamA} /><strong>{scoreboard.totals[teamA.id]}</strong></div>
        <div className="score-middle"><span>{scoreboard.pointsAwarded} awarded</span><div className="track" aria-label={`${scoreboard.pointsAwarded} of ${activeTrip.totalPoints} points awarded`}><span style={{ width: `${(scoreboard.pointsAwarded / activeTrip.totalPoints) * 100}%` }} /></div><b>{scoreboard.pointsRemaining} points remaining</b></div>
        <div className="score-team right"><TeamMark team={teamB} /><strong>{scoreboard.totals[teamB.id]}</strong></div>
      </div>
      <p className="status-line"><span className="status-dot" /> {activeTrip.matches.length ? "Results update as matches are completed." : "Teams and pairings will follow Friday night’s draft."}</p>
    </section>

    <section className="latest section-shell" aria-labelledby="latest-title"><div className="latest-stamp">Latest<br />Update</div><div><div className="section-label">From the clubhouse · {activeTrip.updates[0]?.date}</div><h2 id="latest-title">{activeTrip.updates[0]?.title}</h2><p>{activeTrip.updates[0]?.detail}</p></div></section>

    <section id="itinerary" className="section-shell itinerary" aria-labelledby="itinerary-title">
      <div className="section-label">The Itinerary</div><h2 id="itinerary-title">Four rounds.<br /><em>One cup.</em></h2>
      <div className="day-list">{activeTrip.days.map((day, index) => <article className={`day-card ${day.type}`} key={day.id}>
        <div className="day-number">0{index + 1}</div><div className="day-date"><span>{day.day}</span><strong>{day.date}</strong></div>
        <div className="day-main"><h3>{day.course}</h3><p>{day.format}</p><small>{day.detail}</small></div>
        <div className="day-meta"><span>{day.teeTime}</span>{day.points > 0 && <b>{day.points} pts</b>}</div>
      </article>)}</div>
    </section>

    <section className="teams section-shell" aria-labelledby="teams-title">
      <div><div className="section-label">The Sides</div><h2 id="teams-title">Draft night<br /><em>decides it.</em></h2><p>Two captains will select teams in a snake draft after Doon Brae. The board updates once the picks are in.</p></div>
      <div className="team-cards">{activeTrip.teams.map((team) => <article className="team-card" key={team.id} style={{ "--team-color": team.color } as React.CSSProperties}>
        <div className="team-card-rule" /><p>{team.captain ? `Captain ${team.captain}` : "Captain TBD"}</p><h3>{team.name}</h3>
        {team.playerIds.length ? <ul>{team.playerIds.map((id) => <li key={id}>{playerNames([id])}</li>)}</ul> : <div className="draft-pending">Draft pending</div>}
      </article>)}</div>
    </section>

    <section id="results" className="results section-shell" aria-labelledby="results-title">
      <div className="section-label">Match Results</div><h2 id="results-title">The matches</h2>
      <div className="results-list">{activeTrip.days.filter((day) => day.type === "competition").map((day) => {
        const matches = activeTrip.matches.filter((match) => match.dayId === day.id); const scores = getDayScore(activeTrip, day.id);
        return <article className="result-day" key={day.id}><header><div><span>{day.day} · {day.date}</span><h3>{day.course}</h3><p>{day.format}</p></div><div className="day-score"><span>{scores[teamA.id]} — {scores[teamB.id]}</span><small>of {day.points} pts</small></div></header>
          {matches.length ? <div className="match-list">{matches.map((match) => <div className="match-row" key={match.id}>
            <div><TeamMark compact team={activeTrip.teams.find((team) => team.id === match.teamA)!} /><strong>{playerNames(match.playersA)}</strong></div>
            <div className="match-result"><span>{match.status === "final" ? match.result : match.status === "in_progress" ? "In progress" : "Teeing off soon"}</span><b>{match.pointsA}–{match.pointsB} pts</b></div>
            <div className="match-right"><TeamMark compact team={activeTrip.teams.find((team) => team.id === match.teamB)!} /><strong>{playerNames(match.playersB)}</strong></div>
          </div>)}</div> : <div className="pairings-empty"><span>○</span><div><strong>Pairings forthcoming</strong><p>Captains will post the matchups after the draft.</p></div></div>}
        </article>;
      })}</div>
    </section>

    <section className="notes section-shell" aria-labelledby="notes-title"><div><div className="section-label">Trip Notes</div><h2 id="notes-title">From the first tee</h2></div><ul>{activeTrip.notes.map((note) => <li key={note}>{note}</li>)}</ul></section>
    <footer><span>Screen Door Open · 2026</span><span>Play hard. Keep score.</span></footer>
  </main>;
}
