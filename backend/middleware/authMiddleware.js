const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach identity AND role
      req.user = {
        id: decoded.id,
        role: decoded.role
      };

      return next();
    } catch (error) {
      console.log('invalid token');
      return res.status(401).json({ message: "Invalid token" });
    }
  }
  console.log('invalid');
  return res.status(401).json({ message: "No token provided" });
};

const admin = (req, res, next) => {
  // Since 'protect' ran first, req.user is already populated!
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    // 403 means "I know who you are, but you don't have permission"
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { protect, admin };
