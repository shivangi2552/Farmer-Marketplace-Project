const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'shipped'], default: 'pending' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
