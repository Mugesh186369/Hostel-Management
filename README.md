# 🏠 Hostel Complaint Management System

A complete, production-ready cloud-based hostel complaint management system built with **Express.js**, **MongoDB**, and **Socket.io** for real-time updates.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Express.js](https://img.shields.io/badge/Express.js-4.18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 👨‍🎓 Student Features
- **Secure Login**: Role-based authentication using User ID, Email, and Password
- **Complaint Registration**: Submit complaints with room number, category, and detailed description
- **Real-time Tracking**: Live complaint tracker showing real-time status updates via Socket.io
- **Complaint History**: View all submitted complaints with timestamps and status

### 👨‍💼 Administrator Features
- **Admin Dashboard**: View all student complaints sorted chronologically (newest first)
- **Status Management**: Update complaint status (Pending, In Progress, Resolved)
- **Progress Notes**: Add admin notes and progress updates
- **Statistics Dashboard**: View complaint statistics (Pending, In Progress, Resolved, Total)
- **Filter & Search**: Filter complaints by status
- **Complaint Details**: View full complaint details with student information
- **Real-time Updates**: See new complaints and status changes in real-time

## 🚀 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern gradients and animations
- **JavaScript (ES6+)** - Client-side logic
- **Socket.io Client** - Real-time updates
- **Font Awesome** - Icons

## 📁 Project Structure

```
hostel-complaint-system/
├── frontend/                 # All frontend code
│   ├── index.html           # Login page
│   ├── student/             # Student pages
│   │   ├── dashboard.html   # Student dashboard
│   │   └── tracker.html     # Complaint tracker
│   ├── admin/               # Admin pages
│   │   └── dashboard.html   # Admin dashboard
│   ├── css/                 # Stylesheets
│   │   ├── login.css        # Login page styles
│   │   └── styles.css       # Dashboard styles
│   └── js/                  # JavaScript files
│       ├── api.js           # API helper functions
│       ├── socket.js        # Socket.io client
│       ├── auth.js          # Authentication functions
│       ├── login.js         # Login page logic
│       ├── student.js       # Student dashboard logic
│       └── admin.js         # Admin dashboard logic
│
├── backend/                  # All backend & database code
│   ├── server.js            # Express.js server entry point
│   ├── package.json         # Node.js dependencies
│   ├── models/              # MongoDB database models
│   │   ├── User.js          # User model (Student/Admin)
│   │   ├── Complaint.js     # Complaint model
│   │   └── AdminUpdate.js   # Admin update history model
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes (login, register)
│   │   ├── complaints.js    # Student complaint routes
│   │   └── admin.js         # Admin routes
│   └── middleware/          # Middleware functions
│       └── auth.js          # JWT authentication middleware
│
├── README.md                 # Main documentation
├── PROJECT_STRUCTURE.md      # Detailed structure guide
├── GITHUB_UPLOAD.md          # GitHub upload guide
└── .gitignore               # Git ignore rules
```

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- npm or yarn package manager

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/hostel-complaint-system
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

**For MongoDB Atlas (cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-complaint-system
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

**Or use MongoDB Atlas (Cloud):**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster (free tier available)
- Get connection string
- Update `MONGODB_URI` in `.env` file

### Step 4: Run the Application

**Development mode (with auto-reload):**
```bash
cd backend
npm run dev
```

**Production mode:**
```bash
cd backend
npm start
```

The server will start on `http://localhost:3000`

## 🧪 Testing the System

### Register Test Accounts

1. Open `http://localhost:3000`
2. Click "Register here"
3. Create accounts:
   - **Student**: User ID, Email, Password, Room Number
   - **Admin**: User ID, Email, Password (no room number)

### Test Workflow

1. **Login as student** → Submit a complaint
2. **Login as admin** → View complaint → Update status → Add notes
3. **Check real-time updates** → See changes instantly via Socket.io

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Complaints (Student)
- `GET /api/complaints/my-complaints` - Get student's complaints
- `POST /api/complaints/create` - Create new complaint
- `GET /api/complaints/:id` - Get complaint by ID

### Admin
- `GET /api/admin/complaints` - Get all complaints (with optional status filter)
- `GET /api/admin/stats` - Get complaint statistics
- `GET /api/admin/complaints/:id` - Get complaint details
- `PUT /api/admin/complaints/:id/status` - Update complaint status
- `PUT /api/admin/complaints/:id/resolve` - Mark complaint as resolved

## 📡 Real-time Updates

The system uses Socket.io for real-time bidirectional communication:
- **Students**: Receive instant updates when complaint status changes
- **Admins**: Get notified when new complaints are submitted

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Helmet.js security headers
- Input validation

## 🗄️ Database Schema

### Users Collection
- `userId` - Unique user identifier
- `name` - Full name
- `email` - Email address (unique)
- `password` - Hashed password
- `role` - 'student' or 'admin'
- `roomNumber` - Room number (for students only)

### Complaints Collection
- `studentId` - Reference to User
- `roomNumber` - Room number
- `category` - Complaint category
- `description` - Complaint details
- `status` - 'pending', 'in-progress', or 'resolved'
- `adminNotes` - Administrator notes
- `createdAt` - Submission timestamp
- `updatedAt` - Last update timestamp

## 🚢 Deployment

See `FREE_HOSTING_GUIDE.md` for complete free hosting instructions.

### Quick Deploy (Railway - Recommended)

1. Push code to GitHub
2. Sign up at [Railway](https://railway.app)
3. New Project → Deploy from GitHub repo
4. Add MongoDB database (built-in)
5. Add environment variables
6. Generate domain
7. **Done!** Your app is live 🎉

For detailed steps, see `FREE_HOSTING_GUIDE.md`

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- Verify connection string format

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill process using port 3000

### JWT Token Errors
- Check `JWT_SECRET` is set in `.env`
- Clear browser localStorage and login again

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Author

Your Name - [@yourusername](https://github.com/yourusername)

---

**Built with ❤️ for efficient hostel management**
