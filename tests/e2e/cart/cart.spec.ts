import { test, expect } from '@playwright/test';
import { CatalogPage } from '@pages/product/catalog.page';
import { CartPage } from '@pages/cart/cart.page';

test.describe('Cart', () => {
  let catalog: CatalogPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    catalog = new CatalogPage(page);
    cart = new CartPage(page);
  });

  test('adds a product to cart and verifies cart contents', async () => {
    const { name } = await test.step('Open any product from home', async () => {
      return await catalog.openAnyProductFromHome();
    });

    await test.step('Add product to cart', async () => {
      await catalog.addToCartFromPdp();
    });

    await test.step('Open cart', async () => {
      await cart.goToCart();
    });

    await test.step('Verify cart contains product', async () => {
      if (name) {
        await cart.expectHasLineItemForProduct(name);
      }
    });
  });

  test('updates quantity and verifies totals update', async () => {
    await test.step('Open any product from home', async () => {
      await catalog.openAnyProductFromHome();
    });

    await test.step('Add product to cart', async () => {
      await catalog.addToCartFromPdp();
    });

    await test.step('Open cart', async () => {
      await cart.goToCart();
    });

    await test.step('Update quantity and verify totals change', async () => {
      const beforeTotal = await cart.getTotalText();
      await cart.setFirstLineItemQuantity(2);

      await expect.poll(async () => await cart.getTotalText()).not.toBe(beforeTotal);
    });
  });

  test('removes an item from the cart after setting quantity to 2', async () => {
    await test.step('Open any product from home', async () => {
      await catalog.openAnyProductFromHome();
    });

    await test.step('Add product to cart', async () => {
      await catalog.addToCartFromPdp();
    });

    await test.step('Open cart', async () => {
      await cart.goToCart();
    });

    await test.step('Set quantity to 2', async () => {
      await cart.setFirstLineItemQuantity(2);
    });

    await test.step('Remove item and verify empty cart', async () => {
      await cart.removeFirstLineItem();
      await cart.expectEmptyCart();
    });
  });
});
