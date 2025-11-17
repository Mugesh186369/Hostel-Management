# 🚀 Setup Guide - Hostel Complaint System

## ✅ Project Structure

Your project is organized with clear separation:

```
hostel-complaint-system/
├── frontend/              # All frontend code (HTML, CSS, JavaScript)
├── backend/               # All backend & database code (Node.js, Express, MongoDB)
├── README.md              # Documentation
└── .gitignore            # Git ignore rules
```

## 📋 Quick Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Setup Environment

Create `backend/.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/hostel-complaint-system
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

### Step 3: Start MongoDB

**Local:**
```bash
mongod
```

**Cloud (MongoDB Atlas):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### Step 4: Run Server

```bash
cd backend
npm start
```

**Or with auto-reload:**
```bash
npm run dev
```

### Step 5: Access Application

Open browser: `http://localhost:3000`

## ✅ Done!

Your system is ready to use!

