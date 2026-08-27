# Screen Door Open · 2026

A static, mobile-first scoreboard for the September 18–21 golf trip. It is designed for GitHub Pages: there is no server, account, database, or recurring cost.

## Update the trip during the weekend

All content lives in `src/data/trip.ts`. Edit that one file directly in GitHub, commit the change to `main`, and GitHub Pages will publish the new scorecard automatically.

1. After Friday's draft, add each player under `players`, assign captain names, and place player IDs into each team's `playerIds` array.
2. When captains set pairings, add a match to `matches`. Use `scheduled` before tee-off and `in_progress` during play.
3. When a match is done, set `status` to `final`, enter its result text, and give each team its earned points. Only final matches affect the overall score.
4. Add a short announcement at the beginning of `updates` to change the “Latest Update” panel. Edit `notes` for weather, logistics, or other trip notes.

The data file includes a copy-ready match example. A tied match can award split points such as `0.5` and `0.5`.

To preview a fully populated scorecard before the draft, change `showExampleResults` to `true` in `src/data/trip.ts`. It displays fictional teams and results only; set it back to `false` before the trip.

## Run locally

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Use `npm test` for scoring-calculation tests and `npm run build` to create the production site in `dist/`.

## Publish on GitHub Pages

1. Push this repository to GitHub and make `main` the default branch.
2. In the repository’s **Settings → Pages**, select **GitHub Actions** as the build source.
3. Push to `main`. The included workflow builds and deploys the site.

The workflow deploys it at the normal project-site path, such as `https://your-account.github.io/screen-door-open/`. If this will be the root personal site (`your-account.github.io`), change the workflow’s `VITE_BASE_PATH` value to `/`.
