# Classroom Seating Planner

A standalone version of the seating planner, storing data online via Netlify Blobs
instead of Claude's artifact storage. No login system — this is built for single-user
use, as agreed.

## Local development

```bash
npm install
npm run dev
```

Netlify Functions (used for storage) only run under the Netlify CLI, not plain `vite dev`.
For full local testing including storage, install the Netlify CLI and run:

```bash
npm install -g netlify-cli
netlify dev
```

This runs the Vite dev server and the functions together, proxied to the same port.

## Deploying to Netlify

1. Push this project to a Git repository (GitHub, GitLab, etc.), or drag-and-drop the
   built `dist` folder directly in the Netlify dashboard.
2. If connecting a Git repo: in Netlify, "Add new site" → "Import an existing project",
   pick the repo. Build command and publish directory are already set via `netlify.toml`
   (`npm run build`, `dist`), so you shouldn't need to change anything.
3. **Enable Blobs**: Netlify Blobs is available by default on all sites — no extra setup
   or account needed beyond your existing Netlify account.
4. Deploy. Your data will now be saved online via Netlify Blobs, accessible from any
   device/browser you open the deployed site from.

## Backup

Use the "Export backup" / "Import backup" buttons in the app to download or restore all
your classes as a single JSON file — a good idea to do occasionally, independent of
where the data lives.

## Project structure

```
src/
  App.jsx              — top-level state and orchestration
  components/          — UI pieces (Grid, Sidebar, SeatModal, etc.)
  lib/
    constants.js        — desk/furniture/colour definitions
    utils.js             — small pure helpers
    storage.js           — client-side calls to the Netlify Functions
    exportImport.js      — backup file export/import
netlify/functions/       — serverless functions backed by Netlify Blobs
```

## Notes

- No password/login is set up (per your instruction — it's just you). Anyone with the
  deployed URL could view the data. If that changes, Netlify's own site-level password
  protection (Site settings → Visitor access) is the simplest lock to add without any
  code changes.
- Student names, SEND status, and behaviour notes will live on Netlify's servers once
  deployed — worth checking this fits your school's data policy.
