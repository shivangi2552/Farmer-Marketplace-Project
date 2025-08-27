const express = require('express');
const router = express.Router();
const {
  createOrder,
  captureOrder
} = require('../controllers/paymentController');

router.post('/create', createOrder);
router.post('/capture', captureOrder);

module.exports = router;
