import { 
  UserModel, 
  MerchantModel, 
  CustomerModel, 
  ProductModel, 
  TransactionModel,
  Supplier, 
  SubscriptionPlan,
  SubscriptionTier,
  CategoryModel,
  UserRole
} from "@/types";

// Correct the subscription plans to use string arrays for features
export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    productLimit: 10,
    features: ["Up to 10 products", "Basic sales reports", "Single user"],
    isActive: true,
    description: "Get started with a free account",
    price: 0,
    // Compatibility with snake_case
    monthly_price: 0,
    annual_price: 0,
    product_limit: 10,
    is_active: true
  },
  {
    id: "plan-starter",
    name: "Starter",
    monthlyPrice: 29.99,
    annualPrice: 299.99,
    productLimit: 100,
    features: ["Up to 100 products", "Advanced reports", "3 users", "Customer management"],
    isActive: true,
    description: "Perfect for small businesses",
    price: 29.99,
    // Compatibility with snake_case
    monthly_price: 29.99,
    annual_price: 299.99,
    product_limit: 100,
    is_active: true
  },
  {
    id: "plan-scale-up",
    name: "Scale Up",
    monthlyPrice: 79.99,
    annualPrice: 799.99,
    productLimit: 1000,
    features: ["Up to 1,000 products", "Inventory management", "10 users", "API access"],
    isActive: true,
    description: "For growing businesses",
    price: 79.99,
    // Compatibility with snake_case
    monthly_price: 79.99,
    annual_price: 799.99,
    product_limit: 1000,
    is_active: true
  }
];

export const mockUsers: UserModel[] = [
  {
    id: "usr1",
    email: "merchant@example.com",
    firstName: "Merchant",
    lastName: "User",
    role: UserRole.MERCHANT,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "usr2",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: UserRole.SUPER_ADMIN,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  }
];

export const mockMerchants: MerchantModel[] = [
  {
    id: "merchant-1",
    userId: "user-1",
    businessName: "Doe's Coffee",
    businessLogo: null,
    subscriptionTier: SubscriptionTier.STARTER,
    productLimit: 100,
    productCount: 50,
    country: "US",
    defaultCurrency: "USD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "merchant-2",
    userId: "user-2",
    businessName: "Smith's Bakery",
    businessLogo: null,
    subscriptionTier: SubscriptionTier.PROFESSIONAL,
    productLimit: 1000,
    productCount: 250,
    country: "CA",
    defaultCurrency: "CAD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockCustomers: CustomerModel[] = [
  {
    id: "customer-1",
    merchantId: "merchant-1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.j@example.com",
    phone: "123-456-7890",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "customer-2",
    merchantId: "merchant-1",
    firstName: "Bob",
    lastName: "Williams",
    email: "bob.w@example.com",
    phone: "987-654-3210",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockProducts: ProductModel[] = [
  {
    id: "product-1",
    merchantId: "merchant-1",
    name: "Latte",
    description: "Classic coffee beverage",
    price: 3.50,
    inStock: 100,
    imageUrl: null,
    barcode: null,
    categoryId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "product-2",
    merchantId: "merchant-1",
    name: "Croissant",
    description: "Buttery pastry",
    price: 2.75,
    inStock: 75,
    imageUrl: null,
    barcode: null,
    categoryId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockTransactions: TransactionModel[] = [
  {
    id: "transaction-1",
    merchantId: "merchant-1",
    customerId: "customer-1",
    amount: 6.25,
    status: "completed",
    paymentMethod: "card",
    reference: "txn-123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "transaction-2",
    merchantId: "merchant-1",
    customerId: "customer-2",
    amount: 3.50,
    status: "completed",
    paymentMethod: "cash",
    reference: "txn-456",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: "supplier-1",
    merchant_id: "merchant-1",
    name: "Coffee Bean Supplier",
    contactName: "Supplier Contact",
    email: "supplier@example.com",
    phone: "555-123-4567"
  },
  {
    id: "supplier-2",
    merchant_id: "merchant-2",
    name: "Flour Supplier",
    contactName: "Flour Contact",
    email: "flour@example.com",
    phone: "555-789-0123"
  }
];

// Add missing mock categories
export const mockCategories: CategoryModel[] = [
  {
    id: "category-1",
    name: "Beverages",
    description: "Coffee, tea, and other drinks",
    merchantId: "merchant-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "category-2",
    name: "Food",
    description: "Pastries and snacks",
    merchantId: "merchant-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
