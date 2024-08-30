const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true, min: 0 },
  transactionDate: { type: Date, default: Date.now },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paymentMethod: { type: String, enum: ['credit card', 'paypal', 'stripe'], required: true },
  transactionStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
