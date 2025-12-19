# Tests

End-to-end tests live under `tests/e2e/`.

- `01-registration.spec.ts` – registration + validation case
- `02-login-session.spec.ts` – login, refresh persistence, logout
- `03-product-discovery.spec.ts` – search path + browse path
- `04-cart.spec.ts` – add to cart + cart mutation
- `05-coupon.spec.ts` – invalid coupon (skips if UI not present)
