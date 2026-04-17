
const express = require('express');
const conn = require('../config/dbConnection'); 


const getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await conn.query(
      `SELECT p.id AS product_id, p.name, p.image, p.description,
              ci.id AS cart_item_id, ci.quantity,
              ci.price_at_add, ci.quantity * ci.price_at_add AS line_total
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1)`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


const addCart = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;

  try {
    // Step 1: ensure cart exists
    await conn.query(
      `INSERT INTO carts (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
      [userId]
    );

    // Step 2: get the cart id explicitly (no subquery inside insert)
    const cartRows = await conn.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId]
    );
    const cartId = cartRows[0].id;

    // Step 3: get product price explicitly
    const productRows = await conn.query(
      `SELECT price FROM products WHERE id = $1`,
      [productId]
    );
    const price = productRows[0].price;

    // Step 4: insert or update quantity
    await conn.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity, price_at_add)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity = $3`,
      [cartId, productId, quantity, price]
    );

    res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error("CART ADD ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
}



const updateCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    if (quantity < 1) {
      // If quantity drops to 0, just remove it
      await conn.query(
        `DELETE FROM cart_items
         WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)
           AND product_id = $2`,
        [userId, productId]
      );
      return res.json({ message: 'Item removed' });
    }

    await conn.query(
      `UPDATE cart_items SET quantity = $3
       WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)
         AND product_id = $2`,
      [userId, productId, quantity]
    );
    res.json({ message: 'Quantity updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


 const removeCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await conn.query(
      `DELETE FROM cart_items
       WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)
         AND product_id = $2`,
      [userId, productId]
    );
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


const clearCart = async (req, res) => {
  const { userId } = req.params;
  try {
    await conn.query(
      `DELETE FROM cart_items
       WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)`,
      [userId]
    );
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
getCart,
addCart,
updateCart,
removeCart,
clearCart
}