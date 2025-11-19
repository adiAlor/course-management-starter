# Course Management System

A comprehensive course management system for educational institutions built with Express.js backend and Next.js frontend.

## Features

### Multi-Role System
- **Admin**: User management, course management, class management, scheduling
- **Instructor**: Upload materials, create assignments/quizzes, view schedule
- **Student**: View materials, submit assignments, take quizzes
- **Leadership**: Analytics dashboard, progress tracking, reports

### Key Features
- JWT-based authentication with HttpOnly cookies
- Role-based access control (RBAC)
- File upload support (PDF, Word, Excel, PPT, images, videos)
- Assignment and quiz management
- Scheduling system
- Responsive design with Tailwind CSS
- Clean, reusable component architecture

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **Next.js 15** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **Radix UI** components
- **React Context** for state management
- **Axios** for API calls
- **React Query** for data fetching

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd course-management-system
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Setup Database
1. Create a MySQL database named `course_management`
2. Import the database schema from `backend/src/config/schema.sql`
3. Update database configuration in `backend/.env`

### 4. Environment Variables - Backend
Create a `.env` file in the `backend` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=course_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# File Upload Configuration
UPLOAD_PATH=uploads
MAX_FILE_SIZE=10485760

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 5. Setup Frontend
```bash
cd frontend
npm install
```

### 6. Environment Variables - Frontend
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```
The backend server will run on `http://localhost:5000`

### 2. Start the Frontend Server
```bash
cd frontend
npm run dev
```
The frontend application will run on `http://localhost:3000`

## Default Accounts

After setting up the database, you can use these default accounts:

### Admin Account
- **Email**: admin@coursemgmt.com
- **Password**: password

### Create Additional Accounts
You can create new accounts through the registration page at `/auth/signup`

## Project Structure

```
course-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── schema.sql
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── auth.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   │   ├── signin/
│   │   │   │   └── signup/
│   │   │   └── dashboard/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   └── utils.ts
│   │   └── middleware.ts
│   ├── .env.local
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/dashboard` - Get dashboard data

## Features Implementation Status

### ✅ Completed
- [x] Authentication system with JWT
- [x] Role-based access control
- [x] Dashboard layout and navigation
- [x] Basic UI components
- [x] Database schema
- [x] API client setup

### 🚧 In Progress
- [ ] User management (CRUD operations)
- [ ] Course management
- [ ] Class management
- [ ] File upload system
- [ ] Assignment and quiz system
- [ ] Scheduling system
- [ ] Analytics dashboard

### 📋 Planned
- [ ] Real-time notifications
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Integration with external LMS systems

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the package.json file for details.

## Support

For support and questions, please open an issue in the repository.