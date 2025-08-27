const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;
    if (!image) return res.status(400).json({ error: 'Image is required' });

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      unit: req.body.unit,
      category: req.body.category,
      image,
      farmer: req.user.userId,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Product creation error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('farmer', 'name');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.userId });
    res.json(products);
  } catch (err) {
    console.error('Error fetching my products:', err);
    res.status(500).json({ error: 'Failed to fetch your products' });
  }
};

exports.searchProducts = async (req, res) => {
  const query = req.query.q;
  try {
    const results = await Product.find({
      name: { $regex: query, $options: 'i' },
    }).populate('farmer', 'name');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
