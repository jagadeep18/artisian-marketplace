# MongoDB Atlas + Express Backend Setup Guide

## 🗄️ MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Start Free" and sign up
3. Create your first organization and project

### Step 2: Create a Cluster
1. Click "Create" to create a new cluster
2. Choose **Shared** (free tier)
3. Select your region (closest to your location)
4. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password
5. Select "Read and write to any database"
6. Click "Add User"

### Step 4: Setup Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (for development)
   - For production, add specific IPs
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" as driver
4. Copy the connection string
5. Replace `<username>`, `<password>`, `<database-name>`

### Step 6: Update .env File

```bash
cd server
# Replace with your connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/artisan-marketplace
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
PORT=5000
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 🚀 Backend Setup

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Start the Backend Server
```bash
npm run dev
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/update-profile` - Update profile (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Protected, Artisan)
- `PUT /api/products/:id` - Update product (Protected, Artisan)
- `DELETE /api/products/:id` - Delete product (Protected, Artisan)
- `GET /api/products/artisan/:artisanId` - Get artisan's products

### Orders
- `POST /api/orders` - Create order (Protected)
- `POST /api/orders/verify` - Verify Razorpay payment (Protected)
- `GET /api/orders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `GET /api/orders/artisan/orders` - Get artisan's orders (Protected)

---

## 🔄 Connecting Frontend to Backend

Your frontend services are already set up to call these APIs. Make sure the backend is running before testing!

### Frontend .env Configuration
```bash
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "client",
    "fullName": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

---

## 🛠️ Project Structure

```
server/
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Review.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   └── orders.js
├── middleware/
│   └── auth.js
├── config/
│   └── db.js
├── server.js
├── .env
├── .env.example
└── package.json
```

---

## 🔐 Security Best Practices

1. **Never commit .env file** to git
2. **Use strong JWT_SECRET** (at least 32 characters)
3. **In production**, restrict Network Access to specific IPs
4. **Use HTTPS** for all API calls
5. **Keep dependencies updated**: `npm update`

---

## 📦 Next Steps

1. ✅ Setup MongoDB Atlas
2. ✅ Update .env with connection string
3. ✅ Run `npm install` in server directory
4. ✅ Start backend: `npm run dev`
5. ✅ Frontend will automatically work with the backend
6. Test authentication and checkout flow

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB URI in .env
- Verify IP is whitelisted in Network Access
- Make sure database user credentials are correct
- Check cluster is running

### "JWT token error"
- Regenerate token after login
- Check JWT_SECRET is the same in .env
- Clear localStorage and try again

### "CORS Error"
- Make sure `cors()` is enabled in server.js
- Frontend URL should be in CORS list
- Check API_URL in frontend .env

---

## 📞 Support

- MongoDB Docs: https://docs.mongodb.com
- Express Docs: https://expressjs.com
- Mongoose Docs: https://mongoosejs.com
