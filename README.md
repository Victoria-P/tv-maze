### TV Maze — Vue TV Shows Dashboard

This is a small Vue 3 + Vite application that demonstrates fetching TV show data from the TVMaze API and presenting it as a genre-based dashboard (horizontal carousels), searchable and sortable by rating.

Summary

- Groups shows by genre and renders horizontal carousels per genre.
- Sorts shows by rating (descending) within each genre.
- Search shows by name (local & remote search supported via API).
- Show details page with sanitized HTML summary and cast list.

Why this structure / architecture

- Framework: **Vue 3** (selected for its modern composition API, reactivity model, and strong ecosystem).
- Build: **Vite** for fast local development and simple production builds.
- State: **Pinia** for a lightweight typed store; store lives in `src/stores/shows.ts` and handles fetching + grouping logic.
- Reusable code: business logic lives in `src/utils/show-util.ts`, API calls in `src/api/tvmaze.ts`, and UI concerns in small focused components under `src/components/`.
- Composition: `useHorizontalPager` is a composable used by carousels to encapsulate scrolling/pagination logic.
- Security: show summaries are sanitized with `DOMPurify` to avoid injecting unsafe HTML into the DOM.

Project layout (high-level)

- `src/api/tvmaze.ts` — wrapper for TVMaze endpoints used by the app.
- `src/stores/shows.ts` — Pinia store: fetches index pages, runs searches, groups by genre and sorts by rating.
- `src/utils/show-util.ts` — mapping, grouping and sorting helpers.
- `src/components/` — UI components: `ShowCarousel.vue`, `ShowsList.vue`, `ShowDetails.vue`, `SearchBar.vue`, common components in `src/components/common`.
- `src/composables/useHorizontalPager.ts` — reusable pager for horizontal scrolling.

Getting started
Prerequisites

- Node.js: this project lists supported engines in `package.json`: Node `^20.19.0 || >=22.12.0`.

Install

```bash
npm install
```

Run locally (dev)

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Tests

- Unit tests use Vitest. Run all tests with coverage:

```bash
npm run test
```

- Run tests in watch mode during development:

```bash
npm run test:watch
```

- UI runner:

```bash
npm run test:ui
```

Notes about tests and coverage

- Tests cover the API layer, store logic, the `useHorizontalPager` composable and most components. The repository contains many `*.spec.ts` files under `src/`.
- The test suite runs in a Node/jsdom environment — some components stub `router-link` or other dependencies to remain unit-focused.

Design & UX notes

- Responsive: components include responsive rules (grid/stack fallbacks) so the layout adapts to smaller viewports.
- Accessibility: `role="list"/"listitem"` and `aria-label` are applied on carousel scrollers.
- Visual: the UI uses a minimal, clean approach to highlight show cards and ratings.

Future improvements

- Add incremental page loading to avoid fetching too many index pages on first load.
- Add E2E tests (Cypress / Playwright) for user flows (search, open details, mobile interactions).
- Add Storybook to the project.
- Improve server-side rendering or pre-rendering for SEO of show pages.
