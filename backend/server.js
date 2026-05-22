const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const requiredProductionEnv = ['MONGODB_URI', 'JWT_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
const isProduction = process.env.NODE_ENV === 'production';
const missingProductionEnv = requiredProductionEnv.filter((key) => !process.env[key]);

if (isProduction && missingProductionEnv.length) {
  console.error(`Missing required production env vars: ${missingProductionEnv.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 4000;
const MONGODB_URI = isProduction ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydb';
const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-jwt-secret';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || 'http://localhost:4200,https://daily-grocery-mart.netlify.app')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : isProduction,
  sameSite: process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax'),
  maxAge: 24 * 60 * 60 * 1000
};

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_ORIGINS,
  credentials: true
}));

// DB connection
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection failed:', err.message));

const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database unavailable. Check backend MONGODB_URI configuration.'
    });
  }

  next();
};

const requireRazorpayConfig = (req, res, next) => {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(503).json({
      message: 'Payment gateway unavailable. Check backend Razorpay environment variables.'
    });
  }

  next();
};

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Middleware to verify JWT from cookie
const authenticateToken = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database unavailable. Check backend MONGODB_URI configuration.'
    });
  }

  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      userId: user._id,
      username: user.username,
      role: user.role,
    };
    next();
  } catch (err) {
      return res.status(403).json({ message: 'Invalid token' });
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }

  next();
};

app.post('/payments/create-order', authenticateToken, requireRazorpayConfig, async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'A valid payment amount is required' });
    }

    const amountInSubunits = Math.round(numericAmount * 100);
    const receipt = `dm_${Date.now()}_${req.user.userId.toString().slice(-6)}`;
    const credentials = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInSubunits,
        currency,
        receipt,
      }),
    });

    const order = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error('RAZORPAY ORDER ERROR:', order);
      return res.status(502).json({
        message: order.error?.description || 'Unable to create payment order',
      });
    }

    res.json({
      keyId: RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (err) {
    console.error('CREATE PAYMENT ORDER ERROR:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/payments/verify', authenticateToken, requireRazorpayConfig, (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification details are required' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    res.json({
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (err) {
    console.error('VERIFY PAYMENT ERROR:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { items, totalAmount, status = 'paid', payment, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const normalizedItems = items.map((item) => ({
      productId: String(item.productId ?? item.id ?? ''),
      name: item.name || item.title || 'Product',
      imageUrl: Array.isArray(item.imageUrl || item.image)
        ? (item.imageUrl || item.image)[0] || ''
        : item.imageUrl || item.image || '',
      quantity: Number(item.quantity ?? item.qty ?? 1),
      price: Number(item.price ?? 0),
    }));

    if (normalizedItems.some((item) => !item.productId || item.quantity < 1 || item.price < 0)) {
      return res.status(400).json({ message: 'Valid order item details are required' });
    }

    const order = await Order.create({
      user: req.user.userId,
      items: normalizedItems,
      totalAmount: Number(totalAmount),
      status,
      payment,
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('CREATE ORDER ERROR:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order
      .find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('GET ORDERS ERROR:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /register - Signup
app.post('/register', requireDatabase, async (req, res) => {
  try {
    const { username, email, name, password } = req.body;

    // Validate input
    if (!username || !email || !name || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      name,
      passwordHash,
      role: 'customer'
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set HttpOnly cookie
    res.cookie('authToken', token, cookieOptions);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /login - Login
app.post('/login', requireDatabase, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Generated JWT:', token); // For debugging, remove in production

    // Set HttpOnly cookie
    res.cookie('authToken', token, cookieOptions);

    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /profile - Get user profile (protected route)
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('PROFILE ERROR:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /logout - Logout
app.post('/logout', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite
  });
  res.json({ message: 'Logged out successfully' });
});

// GET /check-session - Check if user is authenticated
app.get('/check-session', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ authenticated: true, user: user });
  } catch (err) {
    console.error('CHECK SESSION ERROR:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /users - Get all users (for testing, remove in production)
app.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error('GET USERS ERROR:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
