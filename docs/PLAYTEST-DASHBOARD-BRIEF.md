# Next project brief: Playtest dashboard

Draft, 25 November 2026. This is the next milestone after the portfolio. It gets its own folder and repository
(suggested: `outputs/playtest-dashboard`, `DanPiress/playtest-dashboard`) and is not described as finished on the
portfolio until the workflow below works on the deployed site.

## Why this project

ARC shows visual direction, rendering and front-end performance work. It has no saved data, no forms and no
workflow. A small tool for running game playtests fills that gap: real data that survives a reload, validation,
search, export, and clear loading, empty and error states. It also connects to my Roblox interest.

## Scenario for the sample data

A small team is playtesting an obby-style Roblox game across a few builds (for example "Lava Run 0.3" to "0.5").
Sessions have notes like "8 testers, mobile and PC". Issues are things testers really hit: "Checkpoint 4 respawns
the player before the jump", "Jump button overlaps the chat on small phones", "Coins counter resets after a
teleport". The game and team are fictional and labelled as sample data.

## First version: scope

1. **Sessions dashboard:** a list of playtest sessions (game/build, date, number of issues, open issues), newest first.
2. **Create and edit a session:** game/build name (required), date (required), notes (optional, length-limited).
3. **Record an issue** in a session: title (required), description, severity (Low, Medium, High, Blocker) and status
   (Open, In progress, Fixed, Won't fix). Edit and delete with a confirmation.
4. **Filter and search** a session's issues by severity and status, and search title and description.
5. **Save reliably** through a backend. A reload, another device or another browser shows the same data.
6. **Export** a session's issues as CSV (UTF-8, header row, quoted fields, safe against spreadsheet formula
   injection: prefix cells starting with `=`, `+`, `-` or `@`).
7. **Demo mode for visitors**, clearly labelled: opens with the sample scenario, all features work, changes stay in
   that browser and can be reset. Demo data never reaches the real database.

Every screen has loading, empty ("No issues yet: record the first one"), validation and error states that say what
happened and what to do.

Not in the first version: file uploads or screenshots, teams and roles, comments, real-time updates, charts,
integrations with Roblox or issue trackers.

## Suggested architecture

**React + TypeScript + Vite on Netlify, with Supabase (hosted Postgres) for data and sign-in.**

- Tables: `sessions (id, owner_id, game_build, played_on, notes, created_at, updated_at)` and
  `issues (id, session_id, owner_id, title, description, severity, status, created_at, updated_at)`, with check
  constraints on severity and status.
- Sign-in with an email magic link. **Row Level Security on both tables** so each user can only read and write rows
  where `owner_id = auth.uid()`. Tests must prove one account cannot see another's data.
- The browser uses only Supabase's public anon key, which is designed to be public and is safe only because of the
  Row Level Security policies. The service-role key never goes in the front end or the repository.
- Demo mode uses the same interface over a local store (seeded sample data in `localStorage`), behind one data
  interface, so the components don't care which store is active.

**Trade-offs considered**

| Option | For | Against |
| --- | --- | --- |
| Supabase (chosen) | Real Postgres, auth and access rules in one place; free tier; little server code | An external service to configure; rules must be tested carefully |
| Own API (Node + SQLite) on a server | Full control, good learning | Hosting, backups and security become my job; more to build before the workflow works |
| Browser storage only | Simplest, no accounts | Not "saved through a backend"; lost when browser data is cleared; no second device |
| Firebase | Similar convenience | Document database fits relational sessions/issues less naturally; rules are a different skill |

## Quality bar and checks

- Forms are labelled, errors are announced and tied to their fields, and the keyboard reaches everything.
- Works at 360 px wide with no horizontal scrolling; targets at least 44 px.
- Playwright checks: create, edit and delete sessions and issues; validation; filter and search; CSV contents; demo
  reset; data survives reload; a second account cannot see the first account's data; errors shown when the network
  fails.
- No metrics or user claims on the portfolio until they are real.

## Deliverables

A deployed app with demo mode, the repository with a README (setup, schema, policies, how to run checks), a short
case study for the portfolio, and a walkthrough with two maintenance exercises, as for ARC.
