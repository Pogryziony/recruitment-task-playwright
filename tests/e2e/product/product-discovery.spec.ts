import { test, expect } from '@playwright/test';
import { HomePage } from '@pages/home/home.page';
import { SearchResultsPage } from '@pages/product/search.page';
import { CatalogPage } from '@pages/product/catalog.page';
import { routes } from '@config/routes';

test.describe('Product Discovery', () => {
  let home: HomePage;
  let results: SearchResultsPage;
  let catalog: CatalogPage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    results = new SearchResultsPage(page);
    catalog = new CatalogPage(page);
  });

  test("search for invalid keyword returns no results", async () => {
    const invalidKeyword = 'no-such-product-xyz-12345';

    await test.step('Open home', async () => {
      await home.goToHome();
    });

    await test.step(`Search for '${invalidKeyword}'`, async () => {
      await home.search(invalidKeyword);
    });

    await test.step('Wait for results or empty state', async () => {
      await results.waitForResultsOrEmpty();
    });

    await test.step('Verify no results', async () => {
      const count = await results.getResultsCount();
      expect.soft(count).toBe(0);
      await results.expectNoResultsMessage();
    });
  });

  test("search for valid keyword 'shampoo' returns more than 1 result", async () => {
    await test.step('Open home', async () => {
      await home.goToHome();
    });

    await test.step("Search for 'shampoo'", async () => {
      await home.search('shampoo');
    });

    await test.step('Wait for results or empty state', async () => {
      await results.waitForResultsOrEmpty();
    });

    await test.step('Verify results contain shampoo', async () => {
      const count = await results.getResultsCount();
      expect.soft(count).toBeGreaterThan(1);
      await results.expectAllTitlesContain(/shampoo/i);
    });
  });

  test('Path B: browse via category/featured and open a product details page', async () => {
    const { name } = await test.step('Open any product from home', async () => {
      return await catalog.openAnyProductFromHome();
    });

    await test.step('Verify product details page', async () => {
      if (name) {
        await catalog.expectProductTitleContains(name);
      }

      await catalog.expectAddToCartVisible();
    });
  });

  test('Path B: open a product details page from a category listing', async ({ page }) => {
    await test.step('Navigate Home → first Category', async () => {
      await home.goToFirstCategoryFromHome();
      await expect(page).toHaveURL(/rt=product\/category/);
    });

    const { name } = await test.step('Open first product from category listing', async () => {
      return await catalog.openFirstProductFromListing();
    });

    await test.step('Verify product details page', async () => {
      await expect(page).toHaveURL(/rt=product\/product.*product_id=/);
      await catalog.expectProductTitleVisible();
      if (name) {
        await catalog.expectProductTitleContains(name);
      }
    });
  });

  test("Path B: open a product details page from search results for 'makeup'", async ({ page }) => {
    await test.step('Open home and search for makeup', async () => {
      await home.goToHome();
      await home.search('makeup');
      await expect(page).toHaveURL(routes.product.matchers.search);
    });

    await test.step('Wait for results or empty state', async () => {
      await results.waitForResultsOrEmpty();
    });

    const { name } = await test.step('Open first product from search results', async () => {
      // Search results product links also include product_id, so we can reuse the catalog helper.
      return await catalog.openFirstProductFromListing();
    });

    await test.step('Verify product details page', async () => {
      await expect(page).toHaveURL(/rt=product\/product.*product_id=/);
      await catalog.expectProductTitleVisible();
      if (name) {
        await catalog.expectProductTitleContains(name);
      }
    });
  });

  test('Path B: open a product details page from Home → Specials', async ({ page }) => {
    await test.step('Navigate Home → Specials', async () => {
      await home.goToSpecialsFromHome();
      await expect(page).toHaveURL(/rt=product\/special/);
    });

    const { name } = await test.step('Open first product from Specials listing', async () => {
      return await catalog.openFirstProductFromListing();
    });

    await test.step('Verify product details page', async () => {
      await expect(page).toHaveURL(/rt=product\/product.*product_id=/);
      await catalog.expectProductTitleVisible();
      if (name) {
        await catalog.expectProductTitleContains(name);
      }
    });
  });
});
