const express = require('express');
const router = express.Router();
const {
getCart,
addCart,
updateCart,
removeCart,
clearCart
}
= require ('../services/cart')

// ── GET CART ────────────────
router.get('/:userId', getCart);

// ── ADD TO CART ──────────────
router.post('/add', addCart);

// ── UPDATE QUANTITY ──────────
router.put('/update', updateCart);

// ── REMOVE ITEM ───────────────
router.delete('/remove', removeCart);

// ── CLEAR CART ─────────────────
router.delete('/clear/:userId', clearCart);

module.exports = router;