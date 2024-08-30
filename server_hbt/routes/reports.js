const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction.model');

// 1. Total Sales Report
router.get('/total-sales', async (req, res) => {
  try {
    const totalSales = await Transaction.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" }, totalTransactions: { $sum: 1 } } }
    ]);

    res.status(200).json(totalSales[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Sales by Product Report
router.get('/sales-by-product', async (req, res) => {
  try {
    const salesByProduct = await Transaction.aggregate([
      {
        $group: {
          _id: "$product",
          totalAmount: { $sum: "$totalAmount" },
          totalTransactions: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
      { $unwind: "$productDetails" }
    ]);

    res.status(200).json(salesByProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Sales by Date Range Report
router.get('/sales-by-date', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const salesByDate = await Transaction.aggregate([
      { $match: { transactionDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" }, totalTransactions: { $sum: 1 } } }
    ]);

    res.status(200).json(salesByDate[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Sales by Payment Method Report
router.get('/sales-by-payment-method', async (req, res) => {
  try {
    const salesByPaymentMethod = await Transaction.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          totalAmount: { $sum: "$totalAmount" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(salesByPaymentMethod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Sales by Buyer Report
router.get('/sales-by-buyer', async (req, res) => {
  try {
    const salesByBuyer = await Transaction.aggregate([
      {
        $group: {
          _id: "$buyer",
          totalAmount: { $sum: "$totalAmount" },
          totalTransactions: { $sum: 1 }
        }
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'buyerDetails' } },
      { $unwind: "$buyerDetails" }
    ]);

    res.status(200).json(salesByBuyer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
