# 🚀 Complete Setup Guide: MongoDB + Express + React

## 📋 What's Been Set Up

### ✅ Backend (Express + MongoDB)
- Express server in `/server`
- MongoDB models (User, Product, Order, Review)
- REST API routes for Auth, Products, Orders
- JWT authentication middleware
- Razorpay payment integration

### ✅ Frontend (React + TypeScript)
- Updated AuthContext to use backend API
- CartContext for shopping cart management
- New API service to communicate with backend
- Updated .env to point to backend

---

## 🔧 Quick Start

### 1️⃣ MongoDB Atlas Setup (5 minutes)

**Sign up and create cluster:**
```bash
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create shared cluster
4. Create database user (username/password)
5. Whitelist your IP
6. Copy connection string
```

**Update connection string:**
```bash
# Replace in server/.env:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/artisan-marketplace
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB URI and Razorpay keys
# Then start the server
npm run dev
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

### 3️⃣ Frontend Setup

```bash
# Frontend dependencies already installed
# Update .env.local with:
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=your_razorpay_key_id

# Start frontend (different terminal)
npm run dev
```

---

## 🛠️ Project Structure

```
artisan-marketplace/
├── server/                    (NEW - Backend)
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── src/                      (Frontend)
│   ├── services/
│   │   ├── apiService.ts     (NEW - API client)
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── paymentService.ts
│   │   └── authService.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx   (Updated)
│   │   ├── CartContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── Checkout.tsx
│   │   └── ...
│   └── App.tsx
│
├── .env.local               (Updated)
├── MONGODB_SETUP.md        (Setup guide)
└── package.json
```

---

## 📡 How It Works

### Data Flow:
```
User Browser (React)
    ↓
API Calls (axios/fetch)
    ↓
Express Server (Node.js)
    ↓
MongoDB Atlas (Cloud Database)
```

### Authentication Flow:
```
1. User submits email/password
2. Frontend sends to: POST /api/auth/login
3. Backend verifies password with bcryptjs
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. All future requests include token in Authorization header
7. Middleware verifies token on backend
```

---

## 🔑 Environment Variables

### Backend (.env)
```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/artisan-marketplace

# JWT Setup
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_recommended

# Server
PORT=5000
NODE_ENV=development

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=your_key_id_from_razorpay
RAZORPAY_KEY_SECRET=your_key_secret_from_razorpay
```

### Frontend (.env.local)
```bash
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Razorpay
VITE_RAZORPAY_KEY=your_key_id_from_razorpay
```

---

## 📝 Available API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user (Protected)
PUT    /api/auth/update-profile - Update profile (Protected)
```

### Products
```
GET    /api/products           - Get all products (with filters)
GET    /api/products/:id       - Get single product
POST   /api/products           - Create product (Protected, Artisan)
PUT    /api/products/:id       - Update product (Protected, Artisan)
DELETE /api/products/:id       - Delete product (Protected, Artisan)
GET    /api/products/artisan/:id - Get artisan's products
```

### Orders
```
POST   /api/orders             - Create order (Protected)
POST   /api/orders/verify      - Verify payment (Protected)
GET    /api/orders             - Get user orders (Protected)
GET    /api/orders/:id         - Get single order (Protected)
GET    /api/orders/artisan/orders - Get artisan orders (Protected)
```

---

## 🧪 Testing the APIs

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "artisan@example.com",
    "password": "password123",
    "role": "artisan",
    "ownerName": "Priya Sharma",
    "shopName": "Traditional Crafts",
    "mobileNumber": "+91 9876543210",
    "shopAddress": "123 Craft St, Jaipur",
    "pinCode": "302001"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "artisan@example.com",
    "password": "password123"
  }'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products?category=Textiles
```

---

## 🔒 Security Checklist

✅ **Passwords hashed** with bcryptjs (10 salt rounds)  
✅ **JWT tokens** for secure authentication  
✅ **Protected routes** - Only authenticated users can access  
✅ **CORS enabled** for frontend-backend communication  
✅ **MongoDB URI** stored in .env (not in code)  
✅ **JWT_SECRET** stored in .env (not in code)  

### For Production:
- [ ] Use HTTPS only
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Restrict MongoDB IP whitelist to server IP
- [ ] Enable rate limiting on API
- [ ] Setup HTTPS certificates
- [ ] Use environment-specific .env files

---

## 🐛 Common Issues & Fixes

### "Cannot connect to MongoDB"
```bash
✓ Check MongoDB URI is correct
✓ Verify IP is whitelisted in MongoDB Atlas Network Access
✓ Make sure database user credentials are correct
✓ Cluster should be running (check MongoDB Atlas dashboard)
```

### "CORS Error"
```bash
✓ Ensure cors() is in server.js
✓ Frontend URL should match VITE_API_URL
✓ Check backend is running on port 5000
```

### "JWT token invalid"
```bash
✓ Clear localStorage
✓ Relogin to get new token
✓ Check JWT_SECRET is same in .env
```

### "Frontend can't reach backend"
```bash
✓ Is backend running? (npm run dev in server/)
✓ Is MongoDB connected?
✓ Check console for error messages
✓ Verify VITE_API_URL in frontend .env.local
```

---

## 📊 Database Collections

### Users
```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  password: "hashed_password",
  role: "artisan" | "client",
  fullName: String,
  mobileNumber: String,
  shopName: String,
  ownerName: String,
  shopAddress: String,
  pinCode: String,
  verified: Boolean,
  rating: Number,
  totalReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Products
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  materials: [String],
  images: [String],
  artisanId: ObjectId (ref User),
  inStock: Boolean,
  featured: Boolean,
  rating: Number,
  reviewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Next Steps

1. ✅ MongoDB Atlas account created
2. ✅ Connection string obtained
3. ✅ Backend server created
4. ✅ Frontend API service created
5. ⏭️ **Start backend:** `npm run dev` (in server/)
6. ⏭️ **Start frontend:** `npm run dev` (in root)
7. ⏭️ **Test registration/login**
8. ⏭️ **Test product creation**
9. ⏭️ **Test checkout flow**
10. ⏭️ **Deploy to production**

---

## 📚 Useful Resources

- **MongoDB Docs:** https://docs.mongodb.com
- **Express Docs:** https://expressjs.com
- **Mongoose Docs:** https://mongoosejs.com
- **JWT Guide:** https://jwt.io
- **Razorpay Docs:** https://razorpay.com/docs

---

## 💬 Need Help?

Check the error message:
1. Look at browser console (F12)
2. Check backend console for error logs
3. Verify MongoDB connection
4. Check .env files are correct
5. Restart both servers

---

**You now have a professional full-stack setup ready for development and deployment! 🎉**
