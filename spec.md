# Kishore Organic Soaps – Stock Availability Feature

## Current State

The app is a single-page React/TypeScript e-commerce site for 9 soap products. Each product card (`ProductCard` component in `src/frontend/src/App.tsx`) shows:
- Product image
- Product name
- Price (₹80)
- Quantity selector (Minus/Plus buttons)
- "Add to Cart" button

The `Product` interface only has `id`, `name`, `price`, `image`. There is no stock tracking. Cart is managed in `useState<CartItem[]>`. The `addToCart` function adds the selected quantity to cart without any stock check.

## Requested Changes (Diff)

### Add
- `stock` field to `Product` interface and `PRODUCTS` data array (realistic initial values per product, e.g. some "In Stock" >10, some "Low Stock" 1-4, one "Out of Stock" 0)
- `stockLevels` state: `Record<number, number>` initialized from `PRODUCTS` to track live stock per product ID
- Badge data per product: some products get "Best Seller" badge, some get "Limited Stock" badge based on initial stock level
- `StockBadge` component: shows colored pill badge on product card image corner
  - "Best Seller" = gold badge
  - "Limited Stock" = orange badge
- `StockStatus` component: shows availability text below product name
  - stock > 5: "✓ In Stock" in green (#2d7a4f)
  - stock 1-5: "⚡ Hurry! Only X left" in orange (#d97706)
  - stock 0: "✗ Out of Stock" in red (#dc2626)
- When stock is 0: disable "Add to Cart" button (grayed out, not clickable), show "Out of Stock" label on button
- When stock is low (1-4): show orange urgency message on product card
- Quantity selector: clamp max to current stock level (can't select more than available stock)
- When user clicks "Add to Cart": deduct the added quantity from `stockLevels` state

### Modify
- `Product` interface: add `stock: number` field
- `PRODUCTS` array: add `stock` values (varied across the 9 products)
- `ProductCard` component: accept `stock` and `badge` props; render stock status, badge, and conditionally disable button
- `addToCart` in `App`: after adding to cart, update `stockLevels` by deducting the added qty
- `ProductCard` `onQtyChange`: clamp qty to not exceed available stock
- `App` component: initialize `stockLevels` state, pass stock and badge to each `ProductCard`

### Remove
- Nothing removed

## Implementation Plan

1. Add `stock: number` to `Product` interface. Add realistic stock values to `PRODUCTS` array:
   - IDs 1,2,4,6: high stock (15-25) — "In Stock"
   - IDs 3,5: medium stock (6-10) — "In Stock" but not low
   - IDs 7,8: low stock (2-4) — "Hurry! Only X left"
   - ID 9: out of stock (0) — "Out of Stock"
2. Add badge assignments (optional): IDs 1,2 = "Best Seller", IDs 7,8 = "Limited Stock"
3. Add `stockLevels` state initialized from PRODUCTS stock values
4. Create `StockStatusBadge` inline or small component: renders the green/orange/red availability text
5. Create `ProductBadge` inline or small component: renders corner badge on card image
6. Update `ProductCardProps` to accept `stock: number` and `badge?: string`
7. In `ProductCard`: render badge on image, stock status below name, disable button + change label when stock=0, clamp qty max to stock
8. Update `App`'s `addToCart` to call `setStockLevels(prev => ({ ...prev, [product.id]: prev[product.id] - qty }))`
9. Pass `stock={stockLevels[product.id]}` and `badge` to each `ProductCard`
10. Ensure qty selector `onQtyChange` clamps to `Math.min(val, stock)` (handled in App's `setQty`)
11. CSS: stock status styles use inline styles consistent with existing green/gold/cream palette
