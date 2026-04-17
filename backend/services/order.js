const express = require('express');
const db = require('../config/dbConnection');


// POST /api/orders/place
const placeOrder =  async (req, res) => {
    console.log(req.body);
  const { userId } = req.body;

  // Step 1: Fetch cart items using your normal db.query
  const items = await db.query(
    `SELECT ci.quantity, ci.price_at_add,
            p.id AS product_id, p.name, p.image
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = $1)`,
    [userId]
  );

  // Step 2: Check cart isn't empty
  if (items.length === 0) {
    console.log(items)
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Step 3: Calculate total
  const total = items.reduce(
    (sum, item) => sum + item.price_at_add * item.quantity,
    0
  );

  // Step 4, 5, 6: Transaction — needs a raw client
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Create the order row
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status)
       VALUES ($1, $2, 'pending')
       RETURNING id`,
      [userId, total]
    );

    const orderId = orderResult.rows[0].id;

    // Snapshot each cart item into order_items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
           (order_id, product_id, product_name, product_image, quantity, price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.product_id, item.name, item.image, item.quantity, item.price_at_add]
      );
    }

    // Clear the cart
    await client.query(
      `DELETE FROM cart_items
       WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)`,
      [userId]
    );

    await client.query('COMMIT');

    res.json({ success: true, orderId });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order placement failed:', err);
    res.status(500).json({ error: 'Failed to place order' });

  } finally {
    client.release(); // always give the client back to the pool
  }
};


const getOrder = async (req, res) => {
    console.log(req.body);
  const { userId } = req.params;

  // Validate that userId is actually a number
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }

  try {
    const query = `
      SELECT o.*, 
             JSON_AGG(oi.*) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;
    
    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT o.*, 
             JSON_AGG(oi.*) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows ? result.rows : result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if ((result.rows && result.rows.length === 0) || result.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(result.rows ? result.rows[0] : result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
    placeOrder,
    getOrder,
    getAllOrders,
    updateOrderStatus
}