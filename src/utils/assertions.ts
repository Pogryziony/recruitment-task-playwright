import { expect, Locator } from '@playwright/test';

export async function expectNonEmptyList(items: Locator) {
  const count = await items.count();
  expect(count).toBeGreaterThan(0);
}
