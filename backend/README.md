# ForMa Backend API

Backend API for ForMa Child Care Management System.

## Features

- User authentication with JWT
- Role-based access control (Mother, Caretaker, Admin)
- Child profile management
- RESTful API endpoints
- MongoDB database
- Prepared for AI integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/forma_db
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB (make sure MongoDB is installed and running)

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Children
- `GET /api/children` - Get all children (filtered by role)
- `GET /api/children/:id` - Get single child
- `POST /api/children` - Create child (Mother, Admin)
- `PUT /api/children/:id` - Update child (Mother, Admin)
- `DELETE /api/children/:id` - Delete child (Admin only)
- `POST /api/children/:id/activity` - Add activity log (Caretaker, Admin)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/caretakers` - Get all caretakers
- `GET /api/users/mothers` - Get all mothers

## User Roles

1. **Mother**: Can manage their own children's profiles
2. **Caretaker**: Can view assigned children and add activity logs
3. **Admin**: Full access to all features

## Database Models

### User
- email, password, name, role, phone
- profilePhoto
- children (for mothers)
- assignedChildren (for caretakers)

### Child
- childId, name, age, dateOfBirth
- photo
- mother (reference)
- assignedCaretaker (reference)
- assignedRoom, assignedCamera, assignedMic
- allergies, medicalConditions, emergencyContact
- activityLogs (prepared for AI features)

## Future AI Integration

The system is prepared for AI model integration with:
- Activity logs structure
- Camera/Mic assignment fields
- Flexible metadata storage
- Event tracking capabilities
