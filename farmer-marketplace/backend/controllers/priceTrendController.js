const PriceTrend = require('../models/PriceTrend');

// Add a new price entry
exports.addPriceEntry = async (req, res) => {
  const { productName, price } = req.body;
  try {
    const entry = new PriceTrend({ productName, price });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get trend data for a product
exports.getPriceTrend = async (req, res) => {
  const { productName } = req.params;
  try {
    const trend = await PriceTrend.find({ productName }).sort({ recordedAt: 1 });
    res.json(trend);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
