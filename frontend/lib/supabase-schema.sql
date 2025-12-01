-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mongo_id TEXT UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  address TEXT,
  password VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_expires TIMESTAMP,
  order_otp VARCHAR(10),
  order_otp_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mongo_id TEXT UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Product orders (many-to-many users ↔ products)
CREATE TABLE product_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mongo_id TEXT UNIQUE,
  username VARCHAR(255),
  products JSONB,
  order_date TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_date ON orders(order_date DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products are insertable by admins" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Products are updatable by admins" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Products are deletable by admins" ON products
  FOR DELETE USING (true);

-- RLS Policies for orders (users can see their own orders, admins see all)
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (true);

-- RLS Policies for order_items
CREATE POLICY "Order items are viewable by order owner" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Order items are insertable with order" ON order_items
  FOR INSERT WITH CHECK (true);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Storage policy for product images
CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
