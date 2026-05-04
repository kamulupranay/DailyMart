# E-commerce Backend API

A Node.js/TypeScript backend API for an e-commerce application with MongoDB database integration.

## 🚀 Features

- **Authentication**: JWT-based authentication with HttpOnly cookies
- **User Management**: User registration and login
- **Product Management**: CRUD operations for products
- **Shopping Cart**: Add/remove items from cart
- **Order Management**: Place and track orders
- **MongoDB Integration**: Full database support with Mongoose

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with HttpOnly cookies
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-here
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if using MongoDB Community Server)
net start MongoDB

# On macOS (if using Homebrew)
brew services start mongodb/brew/mongodb-community

# On Linux
sudo systemctl start mongod
```

### 4. Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- An admin user (username: `admin`, password: `Password123!`)
- Sample products across different categories

### 5. Start the Development Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:4000`

## 📚 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile (requires auth)

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID

### Cart (requires authentication)
- `GET /cart` - Get user's cart
- `POST /cart/add` - Add item to cart

### Health Check
- `GET /health` - API health status

## 🔧 Development Scripts

```bash
# Start development server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Watch mode for TypeScript compilation
npm run watch

# Seed database with sample data
npm run seed
```

## 🗄️ Database Schema

### User
- `username`: String (unique, required)
- `email`: String (unique, required)
- `name`: String (required)
- `passwordHash`: String (required)
- `createdAt`: Date
- `updatedAt`: Date

### Product
- `name`: String (required)
- `description`: String (required)
- `price`: Number (required, min: 0)
- `category`: String (required)
- `imageUrl`: String
- `stock`: Number (required, min: 0)
- `active`: Boolean (default: true)
- `createdAt`: Date
- `updatedAt`: Date

### Cart
- `userId`: ObjectId (ref: User, unique)
- `items`: Array of cart items
- `createdAt`: Date
- `updatedAt`: Date

### Order
- `userId`: ObjectId (ref: User)
- `items`: Array of cart items
- `totalAmount`: Number (required)
- `status`: String (enum: pending, processing, shipped, delivered, cancelled)
- `shippingAddress`: Object
- `createdAt`: Date
- `updatedAt`: Date

## 🔒 Security Features

- **HttpOnly Cookies**: JWT tokens stored in HttpOnly cookies
- **Password Hashing**: bcryptjs for secure password storage
- **CORS**: Configured for frontend origin
- **Input Validation**: Basic validation on API endpoints

## 🧪 Testing the API

You can test the API using tools like:

- **Postman**: Import the collection and test endpoints
- **curl**: Command line testing
- **Thunder Client**: VS Code extension

### Example Login Request

```bash
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Password123!"}' \
  --cookie-jar cookies.txt
```

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Set strong `JWT_SECRET`
4. Configure proper CORS origins
5. Use HTTPS in production
6. Set `secure: true` on cookies for HTTPS

## 📝 Notes

- The API uses HttpOnly cookies for security
- CORS is configured for `http://localhost:4200` (Angular dev server)
- Update CORS origin for production frontend URL
- Database connection is established on server start
- Error handling is implemented for all endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
