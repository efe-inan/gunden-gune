# 21-Day Personal Development Platform - Backend API

## Overview

This is a complete backend API for a 21-day personal development platform built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication with JWT
- Personalized 21-day development programs
- Daily task management
- Progress tracking and streak system
- Blog management
- Admin dashboard
- File upload handling

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/personal-dev-platform
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| GET | `/api/auth/me` | Get current user | Yes |

### User

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| DELETE | `/api/users/account` | Delete user account | Yes |
| GET | `/api/users/stats` | Get user statistics | Yes |

### Development Areas

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/areas` | Get all development areas | Yes |
| GET | `/api/areas/:id` | Get development area by ID | Yes |
| POST | `/api/areas/:id/test` | Submit assessment test | Yes |

### Programs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/programs` | Create new program | Yes |
| GET | `/api/programs/current` | Get current active program | Yes |
| GET | `/api/programs/:id` | Get program by ID | Yes |
| PUT | `/api/programs/:id/progress` | Update program progress | Yes |
| GET | `/api/programs/:id/tasks/:day` | Get tasks for specific day | Yes |

### Daily Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks/today` | Get today's tasks | Yes |
| PUT | `/api/tasks/:id/complete` | Complete a task | Yes |
| POST | `/api/tasks/:id/reflection` | Add daily reflection | Yes |

### Blog

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blog` | Get all blog posts | No |
| GET | `/api/blog/:slug` | Get blog post by slug | No |
| POST | `/api/blog` | Create blog post | Yes |
| PUT | `/api/blog/:id` | Update blog post | Yes |
| DELETE | `/api/blog/:id` | Delete blog post | Yes |
| POST | `/api/blog/:id/like` | Like a blog post | No |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/stats` | Get platform statistics | Yes |
| GET | `/api/admin/users` | Get all users | Yes |
| GET | `/api/admin/users/:id` | Get user by ID | Yes |
| PUT | `/api/admin/users/:id` | Update user | Yes |
| DELETE | `/api/admin/users/:id` | Delete user | Yes |
| GET | `/api/admin/programs` | Get all programs | Yes |
| POST | `/api/admin/areas` | Create development area | Yes |

### File Upload

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/upload` | Upload a file | Yes |

## Database Models

### User Model
```typescript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  age: Number,
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say',
  dailyTimeCommitment: Number,
  interests: String[],
  developmentAreas: String[],
  currentProgramId: ObjectId,
  completedPrograms: ObjectId[],
  streak: Number,
  totalDays: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### DevelopmentArea Model
```typescript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  icon: String,
  questions: Array<{ id: String, question: String, options: String[] }>,
  totalQuestions: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Program Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  developmentAreaId: ObjectId,
  startDate: Date,
  endDate: Date,
  status: 'active' | 'completed' | 'paused',
  currentDay: Number (1-21),
  completedDays: Number[],
  totalProgress: Number (0-100),
  testResultId: ObjectId,
  dailyTimeCommitment: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### DailyTask Model
```typescript
{
  _id: ObjectId,
  programId: ObjectId,
  dayNumber: Number (1-21),
  tasks: Array<{
    type: 'reading' | 'exercise' | 'practice' | 'reflection' | 'meditation',
    content: String,
    duration: Number,
    completed: Boolean,
    order: Number
  }>,
  reflection: String,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### TestResult Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  areaId: ObjectId,
  answers: Array<{ questionId: String, answer: Number }>,
  score: Number,
  maxScore: Number,
  recommendations: Array<{
    area: String,
    description: String,
    suggestedActivities: String[]
  }>,
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced',
  createdAt: Date,
  updatedAt: Date
}
```

### BlogPost Model
```typescript
{
  _id: ObjectId,
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  category: String,
  tags: String[],
  author: String,
  featuredImage: String,
  published: Boolean,
  publishedAt: Date,
  views: Number,
  likes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  role: 'super_admin' | 'admin' | 'moderator',
  permissions: String[],
  createdAt: Date,
  updatedAt: Date
}
```

## Business Logic

### Program Generation Algorithm

1. **Test Analysis**: Analyzes test results to determine user's skill level
2. **Personalization**: Creates tasks based on:
   - User's time commitment
   - Difficulty level (beginner/intermediate/advanced)
   - Day progression (gradually increases difficulty)
3. **Task Types**: Reading, Exercise, Practice, Reflection, Meditation
4. **Time Allocation**: Distributes available time across task types

### Test Scoring System

- Calculates percentage score based on answers
- Determines difficulty level:
  - Beginner: < 40%
  - Intermediate: 40-70%
  - Advanced: > 70%
- Generates recommendations based on score

### Progress Tracking

- Calculates daily completion percentage
- Updates user streaks
- Tracks total days completed
- Generates insights for further development

## Middleware

- **Authentication**: JWT verification
- **Authorization**: Role-based access control
- **Error Handling**: Centralized error handling
- **Rate Limiting**: Request throttling
- **Validation**: Zod schema validation
- **File Upload**: Multer for file handling

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Helmet security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention (MongoDB)

## Testing

Run type checking:
```bash
npm run type-check
```

Run linting:
```bash
npm run lint
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.ts
│   │   ├── database.ts
│   │   └── validation.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── areaController.ts
│   │   ├── programController.ts
│   │   ├── taskController.ts
│   │   ├── blogController.ts
│   │   ├── adminController.ts
│   │   └── uploadController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── validation.ts
│   │   └── upload.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── DevelopmentArea.ts
│   │   ├── Program.ts
│   │   ├── DailyTask.ts
│   │   ├── TestResult.ts
│   │   ├── BlogPost.ts
│   │   ├── Admin.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── area.ts
│   │   ├── program.ts
│   │   ├── task.ts
│   │   ├── blog.ts
│   │   ├── admin.ts
│   │   ├── upload.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── logger.ts
│   └── index.ts
├── uploads/
├── package.json
├── tsconfig.json
└── .env
```

## License

MIT
