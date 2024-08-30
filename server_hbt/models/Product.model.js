const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    imageUrl: {
        type: String, // URL of the product image
        required: true, // Assuming the image is required for each product
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Product', productSchema);
