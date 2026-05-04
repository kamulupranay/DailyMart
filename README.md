# E-commerce Application with Angular & Node.js

A full-stack e-commerce application built with Angular 21 frontend and Node.js/Express backend with MongoDB database.

## Features

- **User Authentication**: JWT-based authentication with secure HttpOnly cookies
- **Product Management**: Browse, search, and filter products by category
- **Shopping Cart**: Add/remove items, real-time cart updates
- **Order Management**: Place orders, view order history
- **Responsive Design**: Mobile-friendly Angular Material UI
- **RESTful API**: Complete backend API with proper error handling

## Tech Stack

### Frontend
- Angular 21
- Angular Material
- RxJS for reactive programming
- HttpClient for API communication

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (v6 or higher)
3. **Angular CLI** (v21)

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ecommerce
npm install
```

### 2. Install MongoDB

**Windows:**
- Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

**macOS (with Homebrew):**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- Admin user: `admin` / `Password123!`
- Sample products across different categories

### 4. Start the Backend API

```bash
npm run api
```

Backend runs on `http://localhost:4000`

### 5. Start the Angular Frontend

```bash
npm start
```

Frontend runs on `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (requires auth)

### Products
- `GET /products` - Get all products (with filtering/pagination)
- `GET /products/:id` - Get single product

### Cart
- `GET /cart` - Get user's cart (requires auth)
- `POST /cart` - Add item to cart (requires auth)
- `DELETE /cart/:productId` - Remove item from cart (requires auth)

### Orders
- `POST /orders` - Create new order (requires auth)
- `GET /orders` - Get user's orders (requires auth)

## Project Structure

```
ecommerce/
├── backend/
│   ├── index.js          # Main server file
│   ├── models.js         # Database models
│   └── seed.js           # Database seeding script
├── src/
│   ├── app/
│   │   ├── components/   # Angular components
│   │   ├── services/     # Angular services
│   │   └── models/       # TypeScript interfaces
│   └── ...
├── package.json
└── README.md
```

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Server-Side Rendering
```bash
npm run serve:ssr:ecommerce
```

## Usage Guide

1. **Register/Login**: Use the login component to authenticate
2. **Browse Products**: View products on the main page with search/filter
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Checkout**: Go to cart and place an order with shipping address
5. **View Orders**: Check your order history in the profile section

## Security Features

- JWT tokens stored in HttpOnly cookies
- Password hashing with bcryptjs
- CORS protection
- Input validation and sanitization
- Authentication middleware for protected routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
