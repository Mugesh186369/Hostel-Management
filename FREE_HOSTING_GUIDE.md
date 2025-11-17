# 🆓 Free Hosting Guide - Hostel Complaint System

Complete guide to host your project for **FREE** on various platforms.

## 🎯 Best Free Hosting Options

### Option 1: Railway (Recommended) ⭐
**Best for:** Easy deployment, free tier available

### Option 2: Render
**Best for:** Reliable free tier, automatic deployments

### Option 3: MongoDB Atlas + Vercel/Netlify
**Best for:** Separate frontend/backend hosting

---

## 🚂 Option 1: Railway (Recommended)

### Why Railway?
- ✅ **Free tier** with $5 credit monthly
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ Built-in MongoDB support
- ✅ Environment variables management

### Step-by-Step:

#### Step 1: Create Railway Account
1. Go to: https://railway.app
2. Click **"Start a New Project"**
3. Sign up with GitHub (recommended)

#### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Select your repository: `hostel-complaint-system`

#### Step 3: Add MongoDB Database
1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"Add MongoDB"**
3. Railway will create a MongoDB instance
4. Copy the **MongoDB connection string**

#### Step 4: Configure Environment Variables
1. Go to your project → **Variables** tab
2. Add these variables:
   ```
   MONGODB_URI=<paste-your-mongodb-connection-string>
   JWT_SECRET=<generate-a-random-secret-key>
   PORT=3000
   NODE_ENV=production
   ```

#### Step 5: Configure Build Settings
1. Go to **Settings** → **Build**
2. Set **Root Directory:** `backend`
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `npm start`

#### Step 6: Deploy
1. Railway will automatically deploy
2. Wait for deployment to complete
3. Click on your service → **Settings** → **Generate Domain**
4. Your app will be live at: `https://your-app-name.up.railway.app`

### ✅ Done! Your app is live!

---

## 🎨 Option 2: Render

### Why Render?
- ✅ **Free tier** available
- ✅ Automatic SSL certificates
- ✅ GitHub integration
- ✅ Easy MongoDB Atlas integration

### Step-by-Step:

#### Step 1: Create Render Account
1. Go to: https://render.com
2. Sign up with GitHub

#### Step 2: Create MongoDB Database (MongoDB Atlas)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a cluster (choose free M0 tier)
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (allow all IPs)
6. Get connection string

#### Step 3: Deploy Backend on Render
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select repository: `hostel-complaint-system`
4. Configure:
   - **Name:** `hostel-complaint-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
   - **Plan:** Free

#### Step 4: Add Environment Variables
In Render dashboard → **Environment** tab:
```
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-secret-key>
NODE_ENV=production
PORT=10000
```

#### Step 5: Deploy
1. Click **"Create Web Service"**
2. Render will build and deploy
3. Your app will be live at: `https://your-app-name.onrender.com`

**Note:** Free tier services on Render spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

## 🌐 Option 3: MongoDB Atlas + Vercel (Frontend) + Railway (Backend)

### Step 1: Setup MongoDB Atlas
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0 tier)
3. Get connection string

### Step 2: Deploy Backend on Railway
- Follow Railway steps above

### Step 3: Deploy Frontend on Vercel
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** (leave empty - static files)
   - **Output Directory:** `frontend`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
6. Deploy

---

## 🗄️ MongoDB Atlas Setup (Free Tier)

### Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)

### Step 2: Create Cluster
1. Click **"Build a Database"**
2. Choose **FREE (M0) Shared** cluster
3. Select cloud provider and region
4. Click **"Create"**

### Step 3: Create Database User
1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and password
5. Set privileges: **"Atlas admin"**
6. Click **"Add User"**

### Step 4: Whitelist IP Address
1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for hosting)
   - Or add specific IPs for security
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Copy connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `hostel-complaint-system`

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hostel-complaint-system?retryWrites=true&w=majority
```

---

## 🔧 Update Frontend for Production

Update `frontend/js/api.js` to use production API URL:

```javascript
// For production, use your hosted backend URL
const API_BASE_URL = process.env.VITE_API_URL || 
  window.location.origin + '/api';
```

Or hardcode for production:
```javascript
const API_BASE_URL = 'https://your-backend-url.railway.app/api';
```

---

## 📋 Deployment Checklist

### Before Deploying:
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Connection string copied
- [ ] JWT_SECRET generated (use a long random string)
- [ ] Environment variables ready
- [ ] Code pushed to GitHub

### After Deploying:
- [ ] Backend URL working
- [ ] Frontend can connect to backend
- [ ] MongoDB connection successful
- [ ] Can register new users
- [ ] Can login
- [ ] Can submit complaints
- [ ] Real-time updates working

---

## 🆓 Free Tier Limits

### Railway:
- $5 credit per month
- 500 hours of usage
- Enough for small to medium projects

### Render:
- Free tier available
- Services spin down after 15 min inactivity
- First request may be slow (cold start)

### MongoDB Atlas:
- 512 MB storage (free)
- Shared cluster
- Perfect for development and small projects

---

## 🚀 Quick Deploy Commands

### Railway (via CLI):
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Render (via CLI):
```bash
npm install -g render-cli
render login
render deploy
```

---

## 🎯 Recommended Setup

**For best free hosting experience:**

1. **Backend:** Railway (easiest, most reliable)
2. **Database:** MongoDB Atlas (free tier)
3. **Frontend:** Served by Express.js (included with backend)

**Alternative:**
1. **Backend:** Render
2. **Database:** MongoDB Atlas
3. **Frontend:** Vercel (if you want separate hosting)

---

## 📝 Environment Variables Template

Create these in your hosting platform:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-complaint-system
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
PORT=3000
NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ After Deployment

1. **Test your live URL:**
   - Visit: `https://your-app-url.railway.app`
   - Test registration
   - Test login
   - Test complaint submission

2. **Monitor:**
   - Check Railway/Render dashboard for logs
   - Monitor MongoDB Atlas for database usage

3. **Update Documentation:**
   - Add your live URL to README.md
   - Share with users!

---

## 🎉 You're Live!

Your Hostel Complaint System is now hosted for **FREE**! 🚀

---

**Need help?** Check platform documentation:
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

