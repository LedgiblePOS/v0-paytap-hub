import { Product } from "@/types";

// Sample products for POS demo
export const mockProducts = [
  {
    id: "prod1",
    name: "T-Shirt",
    description: "Cotton T-Shirt",
    price: 19.99,
    category_id: "cat1",
    in_stock: 50,
    barcode: "123456789",
    merchant_id: "merch1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: null
  },
  {
    id: "prod2",
    name: "Jeans",
    description: "Denim Jeans",
    price: 49.99,
    category_id: "cat1",
    in_stock: 25,
    barcode: "987654321",
    merchant_id: "merch1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: null
  },
  {
    id: "prod3",
    name: "Shoes",
    description: "Running Shoes",
    price: 79.99,
    category_id: "cat2",
    in_stock: 15,
    barcode: "456789123",
    merchant_id: "merch1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: null
  },
  {
    id: "prod4",
    name: "Hat",
    description: "Baseball Cap",
    price: 14.99,
    category_id: "cat3",
    in_stock: 30,
    barcode: "321654987",
    merchant_id: "merch1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: null
  }
];

// Export mockProducts as mockPosProducts for backward compatibility
export const mockPosProducts = mockProducts;

// Cart item samples
export const mockCartItems = [
  {
    id: "ci1",
    productId: "prod1",
    name: "T-Shirt",
    price: 19.99,
    quantity: 2
  },
  {
    id: "ci2",
    productId: "prod2",
    name: "Jeans",
    price: 49.99,
    quantity: 1
  }
];
