# recruitment-task-playwright

Recruitment task implemented using TypeScript + Playwright Test against the public demo store `https://automationteststore.com`.

- Task statement: [docs/task.md](docs/task.md)
- Engineering notes (decisions/assumptions/limitations): [docs/NOTES.md](docs/NOTES.md)

## Prerequisites

- Node.js 18+ (recommended)
- npm (comes with Node)

## Install

1. Install dependencies:
	- `npm install`
2. Install Playwright browsers:
	- `npx playwright install`

## Run tests

- Run the full suite (headless): `npx playwright test`

Useful variants:

- Headed mode: `npx playwright test --headed`
- UI mode: `npx playwright test --ui`

Stability / stress:

- Repeat each test 3 times: `npx playwright test --repeat-each 3 --reporter=line`

## View HTML report

- `npx playwright show-report`

## Project structure

- `tests/e2e/**` — end-to-end scenarios grouped by domain (cart/login/product/registration)
- `src/pages/**` — business flows and page-level assertions (uses components + routes)
- `src/components/**` — selectors/locators only (no business logic)
- `src/config/env.ts` — base URL + shared timeout defaults
- `src/config/routes.ts` — centralized route paths + URL matchers
- `src/utils/**` — shared helpers (e.g., unique test data generation)

## Routes

Route paths are centralized in [src/config/routes.ts](src/config/routes.ts).

## Import aliases

This project is configured with TypeScript path aliases (see [tsconfig.json](tsconfig.json)) so you can write cleaner imports:

- `@pages/*` → `src/pages/*`
- `@components/*` → `src/components/*`
- `@config/*` → `src/config/*`
- `@utils/*` → `src/utils/*`

