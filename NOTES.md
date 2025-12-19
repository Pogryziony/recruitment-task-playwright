# Notes

## Key decisions
- **Test structure**: page objects + small shared fixtures in `src/`, scenario-focused specs in `tests/e2e/`.
- **Uniqueness**: each run generates a unique username/email/password for registration to avoid collisions.
- **Resilience**: tests avoid relying on product ordering; they pick the first visible product tile and assert via tolerant text/URL checks.
- **Async UI**: cart totals use `expect.poll(...)` where the UI may update after background requests.

## Assumptions
- The site supports account creation at `/index.php?rt=account/create` and login at `/index.php?rt=account/login`.
- Coupon fields may or may not be present on the cart page; the coupon test skips if the UI is absent.

## Known limitations
- Some selectors are intentionally flexible because the site uses mixed markup; if the UI changes significantly, selectors may need tuning.
- The search filtering requirement is implemented as a best-effort (the site’s available filters vary by result set). If range filters aren’t present for a given search, the test currently verifies search results and handles empty results.

## One thing intentionally not implemented
- **Full checkout / payment flow**: skipped because it is often unstable on demo sites (3rd-party gateways, captchas, or conditional steps) and wasn’t strictly required beyond cart/coupon validation.
