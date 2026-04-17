// const pool = require('../config/dbConnection');
const conn = require('../config/dbConnection')
// GET all products or search
const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let result;

    if (search) {
      result = await conn.query(
        "SELECT * FROM products WHERE name ILIKE $1",
        [`%${search}%`]
      );
    } else {
      result = await conn.query("SELECT * FROM products");
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single product
const getProductById = async (req, res) => {
  try {
    const result = await conn.query(
      'SELECT * FROM products WHERE id = $1',
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, image, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const result = await conn.query(
      `INSERT INTO products (name, price, image, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, price, image, description]
    );

    res.status(201).json(result[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, image, description } = req.body;

    const result = await conn.query(
      `UPDATE products
       SET name = $1, price = $2, image = $3, description = $4
       WHERE id = $5
       RETURNING *`,
      [name, price, image, description, req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await conn.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};




