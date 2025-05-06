// contoh di Products.vue
const products = await window.api.fetchProducts();
await window.api.createProduct({ name, barcode, price, stock, min_stock });
