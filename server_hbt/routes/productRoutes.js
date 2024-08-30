const express = require('express');
const router = express.Router();
const {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route to get products
router.get('/', getProducts);

// Routes requiring authorization
router.post('/', authMiddleware('Creator'), addProduct);
router.put('/:id', authMiddleware('Creator'), updateProduct);
router.delete('/:id', authMiddleware('Power User'), deleteProduct);

module.exports = router;
