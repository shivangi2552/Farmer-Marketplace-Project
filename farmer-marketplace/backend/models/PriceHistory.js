// models/PriceHistory.js
import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
});

const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);
export default PriceHistory;
