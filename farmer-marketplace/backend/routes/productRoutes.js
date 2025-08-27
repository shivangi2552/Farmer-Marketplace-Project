const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { authenticateUser } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

// 🔧 Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});
const upload = multer({ storage });

// ✅ Add a new product (corrected route)
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    console.log('📝 Incoming form data:', req.body);
    console.log('📦 File:', req.file);
    console.log('👤 Authenticated user:', req.user);

    const { name, price, description, unit, category, imageUrl } = req.body;

    let imagePath = null;
    if (req.file) {
      imagePath = 'uploads/' + req.file.filename;
    } else if (imageUrl) {
      imagePath = imageUrl;
    } else {
      return res.status(400).json({ error: 'Please provide an image file or URL' });
    }

    // Check if req.user is correctly populated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const product = new Product({
      name,
      price,
      description,
      unit,
      category,
      image: imagePath,
      farmer: req.user.userId,  // Attach the user ID here
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('🔥 Error in POST /products:', err);  // Log error details here
    res.status(500).json({ error: 'Failed to add product', details: err.message });
  }
});

// ✅ Get all products for the authenticated farmer
router.get('/my-products', authenticateUser, async (req, res) => {
  try {
    console.log('➡️ req.user:', req.user);

    if (!req.user || !req.user.userId) {
      console.error('❌ req.user.id is missing!');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const products = await Product.find({ farmer: req.user.userId });
    console.log('✅ Products found:', products.length);

    res.json(products);
  } catch (err) {
    console.error('🔥 Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

// ✅ Get all products
router.get('/', productController.getAllProducts);

// ✅ Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/search', productController.searchProducts);

// ✅ Update product by ID
router.put('/:id', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, unit, imageUrl } = req.body;
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ error: 'Product not found' });

    // Authorization check: only allow the farmer who owns the product to update it
    if (existingProduct.farmer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    let imagePath = existingProduct.image;
    if (req.file) {
      imagePath = 'uploads/' + req.file.filename;
    } else if (imageUrl) {
      imagePath = imageUrl;
    }

    const updatedFields = {
      name,
      price,
      description,
      unit,
      category,
      image: imagePath,
    };

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ✅ Delete product
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Authorization check: only allow the farmer who owns the product to delete it
    if (product.farmer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('🔥 Delete product error:', err.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
