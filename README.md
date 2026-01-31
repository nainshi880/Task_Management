# Task Management Application

A full-stack task management web application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- User Authentication (Register/Login with JWT)
- Task CRUD Operations (Create, Read, Update, Delete)
- Task Status Management (Pending, In Progress, Completed)
- Search Functionality
- Status Filtering
- Responsive Design
- Modern UI/UX
- Password Visibility Toggle
- Persistent Data Storage (MongoDB)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- Vanilla JavaScript (ES6 Modules)
- HTML5
- CSS3 (Responsive Design)
- No frameworks required

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd task-management-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy .env.example to .env and update with your values
# On Windows PowerShell:
Copy-Item .env.example .env

# On Linux/Mac:
cp .env.example .env

# Edit .env file and update MongoDB URI and JWT secret
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies (optional, for http-server)
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If MongoDB is installed locally, start the service
# On Windows (as Administrator):
net start MongoDB

# On Linux/Mac:
sudo systemctl start mongod
# or
mongod
```

Or use MongoDB Atlas (cloud) and update the `MONGODB_URI` in `.env` file.

## Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend

# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:3000`

### Start Frontend Server

Open a new terminal:

```bash
# From frontend directory
cd frontend

# Start development server
npm run dev
# or
npm start
```

The frontend will open in your browser at `http://localhost:8080`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks

- `GET /api/tasks` - Get all tasks (protected)
  - Query params: `status`, `search`
- `GET /api/tasks/:id` - Get single task (protected)
- `POST /api/tasks` - Create task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Task**: Fill in the form with title, description, and status
3. **View Tasks**: All tasks are displayed in a grid layout
4. **Filter Tasks**: Use filter buttons to filter by status
5. **Search Tasks**: Use the search box to find tasks by title or description
6. **Edit Task**: Click "Edit" icon on any task card
7. **Delete Task**: Click "Delete" icon on any task card
8. **Logout**: Click logout button in the header

## Project Structure

```
task-management-app/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & environment config
│   │   ├── models/          # Mongoose models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── tests/               # Test files
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html       # Main HTML file
│   └── src/
│       ├── css/             # Styles
│       ├── js/              # JavaScript modules
│       ├── components/      # Reusable components
│       └── main.js          # App entry point
└── docs/                    # Documentation
```

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### CORS Issues
- Backend has CORS enabled for all origins
- If issues persist, check browser console

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using the port

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
