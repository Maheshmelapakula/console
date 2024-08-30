const Product = require('../models/Product.model');

// GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /api/products
const addProduct = async (req, res) => {
    try {
        const { imageUrl, name, price, description, category } = req.body;
        const newProduct = new Product({imageUrl, name, price, description, category });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
};
