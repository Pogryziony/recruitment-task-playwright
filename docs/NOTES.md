# NOTES

This document describes key engineering decisions, assumptions, known limitations, and what was intentionally not implemented.

## Repository goals

- Provide a small but “real-world maintainable” Playwright Test suite written in TypeScript.
- Cover the required e-commerce flows against a publicly accessible demo store.
- Prefer stability and clear separation of responsibilities over maximal feature coverage.

## Site under test

- Demo store: `https://automationteststore.com`
- Base URL and default timeouts are defined in [src/config/env.ts](../src/config/env.ts) and consumed by [playwright.config.ts](../playwright.config.ts).

## Test architecture

The codebase is intentionally layered to keep tests readable and maintainable:

- `src/components/**` → selectors/locators only
  - No business logic.
  - If a selector becomes flaky due to markup changes, the fix should live here.
- `src/pages/**` → business flows and page-level assertions
  - Examples: “register a user”, “search for a product”, “add to cart”, “apply coupon”.
  - Pages use components for locators and are responsible for waits/assertions.
- `tests/e2e/**` → scenario orchestration only
  - Specs describe the “what” of the scenario, not the “how” of locating/clicking.
  - Specs also own reporting (`test.step`) and recovery policy; page objects expose deterministic page actions.

This is a common shape for larger E2E suites: stable primitives at the bottom, reusable flows in the middle, and small scenario specs at the top.

## Domain-based grouping

To keep navigation intuitive, tests/pages/components are grouped by domain:

- `tests/e2e/{registration,login,product,cart}`
- `src/pages/{auth,home,product,cart}`
- `src/components/{auth,home,product,cart}`

Note: `auth` in `src/pages` combines registration + login flows (because they share UI and “account state” concerns). Tests remain split into `registration` and `login` domains.

## Routes / URLs

All non-trivial URLs and URL matchers are centralized in:

- [src/config/routes.ts](../src/config/routes.ts)

Why:

- Keeps navigation consistent.
- Reduces “magic URLs” in tests/pages.
- Makes it easy to update if the demo site changes routes.

Notes:

- The demo site can represent "search" in more than one URL shape (canonical search route vs a home URL containing `filter_keyword=...`).
- The suite treats “being on the search page” as a semantic state (presence of the “Search Criteria” section) rather than relying only on the URL.

## Import aliases

TypeScript path aliases are configured in [tsconfig.json](../tsconfig.json):

- `@pages/*` → `src/pages/*`
- `@components/*` → `src/components/*`
- `@config/*` → `src/config/*`
- `@utils/*` → `src/utils/*`

Why:

- Makes imports independent of folder depth.
- Keeps diffs smaller when files move.

## Test data & uniqueness

- New users are created with `uniqueUser()` from [src/utils/data.ts](../src/utils/data.ts).
- A fresh username/email is generated per run to avoid collisions on the shared demo environment.

Constraints handled:

- Password generation is bounded to fit the demo site’s validation requirements (e.g., min/max length).

## Stability strategy

Demo sites are inherently flaky. The suite uses a few consistent strategies:

- **Avoid relying on product ordering**
  - Product listings can reorder or change.
  - Tests pick a “first viable product” and then assert using tolerant signals (URL matchers, visible titles).

- **Wait for meaningful state, not just containers**
  - Search and cart pages can render the container before the content stabilizes.
  - For search, the code first ensures the “Search Criteria” section is visible, then waits until either results are present or a “no results” state is visible.
  - For no results, the suite asserts the site’s exact message: “There is no product that matches the search criteria.”

- **Use Playwright’s auto-waits + explicit expectations**
  - Prefer `expect(locator).toBeVisible()` / `toHaveURL()` over manual sleeps.
  - Use `expect.poll(...)` when the UI updates asynchronously (e.g., totals after cart updates).

- **Registration hardening for dynamic Region/State**
  - The demo site sometimes loads region options late or resets the selection.
  - The suite retries selection and, on specific validation failures, re-selects and re-submits.
  - It also re-fills password fields on retry because some validation paths clear them.

## Assumptions

- The demo site routes remain available (account create/login/logout; cart; product details; search pages).
- The cart page exposes coupon UI **when at least one item is in the cart**.
- Search keywords are not stable over time (inventory changes). For the deterministic “no results” case, tests use a deliberately nonsense keyword.

## Known limitations

- Selectors are intentionally flexible in a few areas due to mixed markup across pages.
  - If the site’s HTML changes significantly, adjustments should be made in `src/components/**`.

## One thing intentionally not implemented

- **Range-based filtering (task item 3)** (e.g., a price range slider/buckets or any other “range” filter)

Reason:

- The demo environment does not expose a range filter UI on search/listing pages.
- Making this deterministic would likely require hunting for a specific product/category page that happens to contain such a widget, which adds time and brittleness without improving coverage of the core flows.
- Because the filter UI is inconsistent, any implementation would be mostly “demo-page dependent” rather than a reusable approach.

## Troubleshooting

- If a test fails locally, open the HTML report:
  - `npx playwright show-report`
- If you suspect a transient demo-site failure, re-run with trace on failure already enabled:
  - `npx playwright test`
  - (Trace collection is configured in [playwright.config.ts](../playwright.config.ts))

If you want to inspect a trace zip from `test-results/`:

- `npx playwright show-trace path/to/trace.zip`
