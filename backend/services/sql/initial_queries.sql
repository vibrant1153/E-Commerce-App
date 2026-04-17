CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  price NUMERIC,
  image TEXT,
  description TEXT
);
-- INSERT INTO products (name, price, image, description) VALUES
-- ('Laptop', 1200, '/images/laptop.jpg', 'High performance laptop'),
-- ('Phone', 800, '/images/phone.jpg', 'Latest smartphone');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password TEXT
);

-- ALTER TABLE users
-- ADD COLUMN role VARCHAR(20) DEFAULT 'user';


-- UPDATE users
-- SET role = 'admin'
-- WHERE email = 'halid@test.com';
-- 1. Carts
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One active cart per user
CREATE UNIQUE INDEX IF NOT EXISTS one_active_cart_per_user ON carts(user_id);

-- 2. Cart items
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_add NUMERIC NOT NULL,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (cart_id, product_id)
);


-- 1. Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- status can be: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    total NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Order items (snapshot of what was in the cart at checkout)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE,
    product_name TEXT NOT NULL,   -- snapshot, in case product is deleted later
    product_image TEXT,           -- snapshot
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL -- price at time of purchase
);