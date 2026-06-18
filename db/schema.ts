import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, numeric } from 'drizzle-orm/pg-core';

// 1. Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Products table (Marketplace items)
export const products = pgTable('products', {
  id: text('id').primaryKey(), // We can use uuid or high-entropy string
  title: text('title').notNull(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  image: text('image'),
  category: text('category').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  condition: text('condition').notNull(), // 'New' | 'Like New' | 'Good' | 'Fair'
  description: text('description').notNull(),
  listedDate: text('listed_date').notNull(),
  sellerId: integer('seller_id').references(() => users.id), // Nullable for initial/seed products
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Nullable if guest checkout, but database expects it
  buyerEmail: text('buyer_email').notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  status: text('status').notNull().default('Processing'), // Processing, Shipped, Delivered
  shippingName: text('shipping_name').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  shippingCity: text('shipping_city').notNull(),
  shippingCountry: text('shipping_country').notNull(),
  trackingNumber: text('tracking_number').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Order Items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: text('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull().default(1),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  orders: many(orders),
}));

export const productsRelations = relations(products, ({ one }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
