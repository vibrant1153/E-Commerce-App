const conn = require('../config/dbConnection')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const userExists = await conn.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const result = await conn.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    res.status(201).json(result[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await conn.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await conn.query('SELECT id, name, email, role FROM users');
    res.json(result.rows ? result.rows : result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Only allow 'admin' or 'user' roles
    if (role !== 'admin' && role !== 'user') {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const result = await conn.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );

    if ((result.rows && result.rows.length === 0) || result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows ? result.rows[0] : result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await conn.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if ((result.rows && result.rows.length === 0) || result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    updateUserRole,
    deleteUser
}