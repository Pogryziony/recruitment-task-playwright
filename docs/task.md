Task: E-commerce Website Testing (TypeScript + Cypress/Playwright)
Objective
Validate key e-commerce flows using TypeScript and Cypress or Playwright.
Note: Tests do not have to be implemented against a real production e-commerce
store. You may use any publicly available demo shop, sandbox environment, or a simple
mock/demo storefront of your choice.

Scenarios to Implement
1. User Registration
• Navigate to the signup page.
• Create a new user account using a unique username/email/password.
• Handle user input validations (cover at least one validation case).
• Verify successful registration and expected navigation.
2. Login / Session
• Log in with valid credentials (newly created or existing).
• Verify a clear logged-in state.
• Verify session persistence (e.g., refresh and confirm the user remains logged
in).
• Logout and confirm the logged-out state.
3. Product Discovery — Path A (Search + Filter)
• Use search to find products related to “electronics”.
• Apply available filters to narrow results to a specific range (e.g., price range or
any range-based filter present in the UI).
• Verify that displayed products match the search criteria and applied filters
(handle edge cases such as 0 results).
4. Product Discovery — Path B (Browse / Category / Featured)
• Reach a product via a different navigation path than search (e.g., category
listing, featured products, recommendations).
• Open a product details page.

5. Add to Cart
• Add a product to the cart (from either path).
• Verify the cart updates correctly with the selected item (e.g., name, price,
quantity).

6. Cart Mutations
• Update the cart (change quantity OR remove an item).
• Verify totals update correctly.

7. Coupon / Discount (if available)
• Apply a coupon/promo code (valid or invalid).
• Verify the expected outcome (discount applied or validation message).

Deliberate Complexity
Your implementation should account for realistic challenges such as:
• Asynchronous loading of search results or product lists.
• Unstable ordering of products in listings.
• Dynamic or responsive UI layouts.
• Cart updates performed via background requests with delayed UI updates.
• Conditional or optional checkout steps.
• Ensuring uniqueness of test data (e.g., user registration).

Deliverables
• Source code hosted on GitHub.
• The solution should be submitted as a Pull Request targeting the main branch.
• README.md with instructions on how to install dependencies and run the tests.
• NOTES.md describing key decisions, assumptions, and known limitations.
Additionally, describe one thing you consciously decided not to implement and
explain why.

Additional instruction:
Organize the tests in a way that you would recommend for a real-world project.
