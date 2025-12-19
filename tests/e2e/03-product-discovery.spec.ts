import { test, expect } from '../../src/fixtures/test';
import { HomePage } from '../../src/pages/home.page';
import { SearchResultsPage } from '../../src/pages/search.page';
import { CatalogHelpers } from '../../src/pages/catalog.page';

test.describe('Product Discovery', () => {
  test('Path A: search for "electronics" and handle empty/non-empty results', async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.goto();
    await home.search('electronics');

    await results.waitForResultsOrEmpty();

    // Best-effort: apply a range-based filter if the UI offers one (e.g., price buckets, slider).
    // If not available on this demo page, proceed and record the limitation.
    const rangeFilterApplied = await results.tryApplyRangeFilterFromUI();
    if (!rangeFilterApplied) {
      test.info().annotations.push({
        type: 'note',
        description: 'No range-based filters were present on the search results page; proceeding without filter.',
      });
    }

    const count = await results.results().count();
    if (count === 0) {
      await expect(page.locator('body')).toContainText(/no product|no results/i);
      return;
    }

    // Titles should broadly match query intent (site search may return related items)
    await results.expectAllTitlesContain(/elect|audio|camera|phone|mp3/i);
  });

  test('Path B: browse via category/featured and open a product details page', async ({ page }) => {
    const catalog = new CatalogHelpers(page);
    const { name } = await catalog.openAnyProductFromHome();

    if (name) {
      await expect(page.locator('h1')).toContainText(name);
    }

    await expect(page.locator('a[title*="Add to Cart" i], button[title*="Add to Cart" i], a.cart')).toBeVisible();
  });
});
