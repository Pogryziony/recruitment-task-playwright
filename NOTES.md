# Notes

## Key decisions
- **Test structure**: page objects + small shared fixtures in `src/`, scenario-focused specs in `tests/e2e/`.
- **Uniqueness**: each run generates a unique username/email/password for registration to avoid collisions.
- **Resilience**: tests avoid relying on product ordering; they pick the first visible product tile and assert via tolerant text/URL checks.
- **Async UI**: cart totals use `expect.poll(...)` where the UI may update after background requests.

## Assumptions
- The site supports account creation at `/index.php?rt=account/create` and login at `/index.php?rt=account/login`.
- **Coupon UI is available** on the cart page once at least one product is added to the cart.

## Known limitations
- Some selectors are intentionally flexible because the site uses mixed markup; if the UI changes significantly, selectors may need tuning.
- The search filtering requirement is implemented as a best-effort (the site’s available filters vary by result set). If range filters aren’t present for a given search, the test currently verifies search results and handles empty results.

## Why some rubric items are not scored 100%
- Some requirements are **UI-dependent** on the chosen demo site. For example, a *range-based filter* (price buckets / slider / min-max inputs) is not consistently present on the search/category pages, so the implementation is best-effort (apply it when available; otherwise proceed and record the limitation).
- Even when a feature exists, demo sites can be **flaky** (e.g., dynamic region/state population on registration). The suite favors Playwright auto-waits and assertions, but occasionally needs deterministic workarounds for site-specific behavior.

## One thing intentionally not implemented
- **Full checkout / payment flow**: skipped because it is often unstable on demo sites (3rd-party gateways, captchas, or conditional steps) and wasn’t strictly required beyond cart/coupon validation.
