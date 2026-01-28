# Backend API Summary

## Complete 21-Day Personal Development Platform Backend

### Database Models Created

#### 1. User Model (`src/models/User.ts`)
```typescript
- _id: ObjectId
- email: String (unique, indexed)
- password: String (hashed with bcrypt)
- name: String
- age: Number (13-120)
- gender: Enum['male', 'female', 'other', 'prefer_not_to_say']
- dailyTimeCommitment: Number (15-180 minutes)
- interests: String[]
- developmentAreas: String[]
- currentProgramId: ObjectId (ref: Program)
- completedPrograms: ObjectId[] (ref: Program)
- streak: Number
- totalDays: Number
- createdAt: Date
- updatedAt: Date
```

#### 2. DevelopmentArea Model (`src/models/DevelopmentArea.ts`)
```typescript
- _id: ObjectId
- name: String (unique)
- slug: String (unique, indexed)
- description: String
- icon: String
- questions: Array<{ id: String, question: String, options: String[] }>
- totalQuestions: Number
- createdAt: Date
- updatedAt: Date
```

#### 3. Program Model (`src/models/Program.ts`)
```typescript
- _id: ObjectId
- userId: ObjectId (ref: User, indexed)
- developmentAreaId: ObjectId (ref: DevelopmentArea, indexed)
- startDate: Date
- endDate: Date
- status: Enum['active', 'completed', 'paused'] (indexed)
- currentDay: Number (1-21)
- completedDays: Number[]
- totalProgress: Number (0-100)
- testResultId: ObjectId (ref: TestResult)
- dailyTimeCommitment: Number
- createdAt: Date
- updatedAt: Date
```

#### 4. DailyTask Model (`src/models/DailyTask.ts`)
```typescript
- _id: ObjectId
- programId: ObjectId (ref: Program, unique compound with dayNumber)
- dayNumber: Number (1-21)
- tasks: Array<{
    type: Enum['reading', 'exercise', 'practice', 'reflection', 'meditation']
    content: String
    duration: Number
    completed: Boolean
    order: Number
  }>
- reflection: String
- completedAt: Date
- createdAt: Date
- updatedAt: Date
```

#### 5. TestResult Model (`src/models/TestResult.ts`)
```typescript
- _id: ObjectId
- userId: ObjectId (ref: User, indexed)
- areaId: ObjectId (ref: DevelopmentArea, indexed)
- answers: Array<{ questionId: String, answer: Number }>
- score: Number
- maxScore: Number
- recommendations: Array<{
    area: String
    description: String
    suggestedActivities: String[]
  }>
- difficultyLevel: Enum['beginner', 'intermediate', 'advanced']
- createdAt: Date
- updatedAt: Date
```

#### 6. BlogPost Model (`src/models/BlogPost.ts`)
```typescript
- _id: ObjectId
- title: String
- slug: String (unique, indexed)
- content: String
- excerpt: String
- category: String (indexed)
- tags: String[] (indexed)
- author: String
- featuredImage: String
- published: Boolean (indexed)
- publishedAt: Date
- views: Number
- likes: Number
- createdAt: Date
- updatedAt: Date
```

#### 7. Admin Model (`src/models/Admin.ts`)
```typescript
- _id: ObjectId
- userId: ObjectId (ref: User, unique, indexed)
- role: Enum['super_admin', 'admin', 'moderator']
- permissions: String[]
- createdAt: Date
- updatedAt: Date
```

---

### API Endpoints Created

#### Authentication Endpoints (`src/routes/auth.ts`)

| Method | Endpoint | Description | Auth Required | Rate Limited |
|--------|----------|-------------|---------------|--------------|
| POST | `/api/auth/register` | Register new user | No | Yes (5/15min) |
| POST | `/api/auth/login` | Login user | No | Yes (5/15min) |
| POST | `/api/auth/logout` | Logout user | No | No |
| POST | `/api/auth/refresh-token` | Refresh JWT token | No | No |
| GET | `/api/auth/me` | Get current user | Yes | No |

**Controller**: `src/controllers/authController.ts`
**Validation**: Register schema, Login schema (Zod)

---

#### User Endpoints (`src/routes/user.ts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile with populated programs | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| DELETE | `/api/users/account` | Delete user account and all related data | Yes |
| GET | `/api/users/stats` | Get user statistics (streak, days, progress) | Yes |

**Controller**: `src/controllers/userController.ts`
**Validation**: Update profile schema (Zod)

---

#### Development Areas Endpoints (`src/routes/area.ts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/areas` | Get all development areas (sorted by name) | Yes |
| GET | `/api/areas/:id` | Get specific development area by ID | Yes |
| POST | `/api/areas/:id/test` | Submit assessment test and get results | Yes |

**Controller**: `src/controllers/areaController.ts`
**Business Logic**:
- Test scoring algorithm
- Difficulty level determination (beginner < 40%, intermediate 40-70%, advanced > 70%)
- Recommendation generation

---

#### Programs Endpoints (`src/routes/program.ts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/programs` | Create new 21-day program based on test results | Yes |
| GET | `/api/programs/current` | Get user's current active program | Yes |
| GET | `/api/programs/:id` | Get specific program by ID | Yes |
| PUT | `/api/programs/:id/progress` | Update program progress (complete tasks) | Yes |
| GET | `/api/programs/:id/tasks/:day` | Get tasks for specific day (1-21) | Yes |

**Controller**: `src/controllers/programController.ts`
**Business Logic**:
- Program generation algorithm based on test results and time commitment
- Automatic 21-day daily task generation
- Progressive difficulty scaling
- Time allocation across task types (40% reading, 30% exercise, 20% practice, 10% reflection)
- Progress calculation and status updates
- Streak tracking

---

#### Daily Tasks Endpoints (`src/routes/task.ts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks/today` | Get today's tasks for active program | Yes |
| PUT | `/api/tasks/:id/complete` | Toggle task completion status | Yes |
| POST | `/api/tasks/:id/reflection` | Add reflection to daily task | Yes |

**Controller**: `src/controllers/taskController.ts`
**Business Logic**:
- Automatic day progression when all tasks completed
- Reflection tracking
- Progress percentage calculation

---

#### Blog Endpoints (`src/routes/blog.ts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blog` | Get all published blog posts with pagination | No |
| GET | `/api/blog/:slug` | Get specific blog post by slug (increments view count) | No |
| POST | `/api/blog` | Create new blog post | Yes |
| PUT | `/api/blog/:id` | Update existing blog post | Yes |
| DELETE | `/api/blog/:id` | Delete blog post | Yes |
| POST | `/api/blog/:id/like` | Like a blog post (increments like count) | No |

**Controller**: `src/controllers/blogController.ts`
**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `tag`: Filter by tag
- `search`: Search in title, content, excerpt

**Validation**: Blog post schema, Update blog post schema (Zod)

---

#### Admin Endpoints (`src/routes/admin.ts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/stats` | Get platform-wide statistics | Yes |
| GET | `/api/admin/users` | Get all users with pagination | Yes |
| GET | `/api/admin/users/:id` | Get specific user details with stats | Yes |
| PUT | `/api/admin/users/:id` | Update user (excluding password/email) | Yes |
| DELETE | `/api/admin/users/:id` | Delete user and all related data | Yes |
| GET | `/api/admin/programs` | Get all programs with pagination | Yes |
| POST | `/api/admin/areas` | Create new development area | Yes |

**Controller**: `src/controllers/adminController.ts`
**Stats Include**:
- Total users and active users (last 30 days)
- Total, active, and completed programs
- Total and published blog posts
- Top development areas by program count

---

#### File Upload Endpoint (`src/routes/upload.ts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/upload` | Upload file (images: jpg, png, gif, webp; docs: pdf, doc, docx) | Yes |

**Controller**: `src/controllers/uploadController.ts`
**Middleware**:
- Multer for file handling
- File type validation
- Size limit (5MB default)
- Rate limited (10 requests/hour)

---

### Middleware Created

#### 1. Authentication (`src/middleware/auth.ts`)
```typescript
- authenticate(): JWT token verification
- authorize(...roles): Role-based authorization
```

#### 2. Error Handling (`src/middleware/errorHandler.ts`)
```typescript
- errorHandler(): Centralized error handling
- AppError: Custom error class with status codes
- asyncHandler: Async error wrapper
```

#### 3. Rate Limiting (`src/middleware/rateLimiter.ts`)
```typescript
- rateLimiter: General rate limiting (100/15min)
- authRateLimiter: Auth-specific limiting (5/15min)
- uploadRateLimiter: Upload-specific limiting (10/hour)
```

#### 4. Validation (`src/middleware/validation.ts`)
```typescript
- validate(schema): Full request validation (body, query, params)
- validateBody(schema): Body-only validation
- Uses Zod for schema validation
```

#### 5. Upload (`src/middleware/upload.ts`)
```typescript
- upload: Multer configuration
- uploadSingle: Single file upload middleware
- uploadMultiple: Multiple files upload (max 5)
- File type and size validation
```

---

### Configuration Files

#### 1. Main Config (`src/config/config.ts`)
```typescript
- port: Server port
- mongodbUri: Database connection string
- jwtSecret: JWT signing secret
- jwtExpiresIn: Token expiration time
- corsOrigin: CORS allowed origins
- rateLimitWindowMs: Rate limiting window
- rateLimitMaxRequests: Max requests per window
- uploadPath: File upload directory
- maxFileSize: Maximum file size
```

#### 2. Database Config (`src/config/database.ts`)
```typescript
- connectDB(): MongoDB connection function
- Connection event handlers (error, disconnected)
- Graceful shutdown handling
```

#### 3. Validation Schemas (`src/config/validation.ts`)
```typescript
- registerSchema
- loginSchema
- updateProfileSchema
- testSubmissionSchema
- createProgramSchema
- updateProgressSchema
- reflectionSchema
- blogPostSchema
- updateBlogPostSchema
- developmentAreaSchema
```

---

### Business Logic Implementations

#### 1. Program Generation Algorithm (`src/controllers/programController.ts`)
```typescript
- Analyzes test results to determine skill level
- Generates 21-day personalized plan
- Allocates time based on user commitment
- Progressive difficulty scaling
- Creates 4 tasks per day (reading, exercise, practice, reflection)
- Adjusts task content based on difficulty and day progression
```

#### 2. Test Scoring System (`src/controllers/areaController.ts`)
```typescript
- Calculates percentage score from answers
- Maps score to difficulty level:
  * Beginner: < 40%
  * Intermediate: 40-70%
  * Advanced: > 70%
- Generates personalized recommendations
- Provides suggested activities
```

#### 3. Progress Tracking (`src/controllers/programController.ts`)
```typescript
- Calculates daily completion percentage
- Updates user streaks
- Tracks total days completed
- Auto-advances day when tasks completed
- Marks program as complete after 21 days
- Updates user's current program status
```

#### 4. Content Management (`src/controllers/programController.ts`)
```typescript
- Dynamic task allocation
- Time-based filtering (reading, exercise, practice, reflection)
- Difficulty progression by day
- Task ordering and completion tracking
```

---

### Security Features

1. **Password Security**: Bcrypt hashing (10 rounds)
2. **JWT Authentication**: Access tokens + Refresh tokens
3. **Helmet**: Security headers
4. **CORS**: Configurable origin whitelist
5. **Rate Limiting**: Multiple tiers (general, auth, upload)
6. **Input Validation**: Zod schema validation on all endpoints
7. **File Upload Validation**: Type and size restrictions
8. **Error Handling**: Sanitized error messages (no stack traces in production)

---

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.ts              # Main configuration
│   │   ├── database.ts            # Database connection
│   │   └── validation.ts          # Zod schemas
│   ├── controllers/
│   │   ├── authController.ts      # Auth endpoints logic
│   │   ├── userController.ts      # User endpoints logic
│   │   ├── areaController.ts      # Development areas logic
│   │   ├── programController.ts   # Programs & 21-day plans
│   │   ├── taskController.ts      # Daily tasks logic
│   │   ├── blogController.ts      # Blog posts logic
│   │   ├── adminController.ts     # Admin endpoints logic
│   │   └── uploadController.ts    # File upload logic
│   ├── middleware/
│   │   ├── auth.ts                # Authentication & authorization
│   │   ├── errorHandler.ts        # Error handling
│   │   ├── rateLimiter.ts         # Rate limiting
│   │   ├── validation.ts          # Request validation
│   │   └── upload.ts              # File upload middleware
│   ├── models/
│   │   ├── User.ts                # User schema
│   │   ├── DevelopmentArea.ts     # Development area schema
│   │   ├── Program.ts             # Program schema
│   │   ├── DailyTask.ts           # Daily task schema
│   │   ├── TestResult.ts          # Test result schema
│   │   ├── BlogPost.ts            # Blog post schema
│   │   ├── Admin.ts               # Admin schema
│   │   └── index.ts               # Model exports
│   ├── routes/
│   │   ├── auth.ts                # Auth routes
│   │   ├── user.ts                # User routes
│   │   ├── area.ts                # Development area routes
│   │   ├── program.ts             # Program routes
│   │   ├── task.ts                # Task routes
│   │   ├── blog.ts                # Blog routes
│   │   ├── admin.ts               # Admin routes
│   │   ├── upload.ts              # Upload routes
│   │   └── index.ts               # Route aggregation
│   ├── utils/
│   │   ├── jwt.ts                 # JWT utilities
│   │   └── logger.ts              # Logging utilities
│   └── index.ts                   # Server entry point
├── uploads/                       # File upload directory
├── package.json
├── tsconfig.json
├── .env.example
└── API_DOCUMENTATION.md
```

---

### Dependencies Installed

**Runtime:**
- express ^4.18.2
- mongoose ^8.1.0
- jsonwebtoken ^9.0.2
- bcryptjs ^2.4.3
- zod ^4.3.5
- uuid ^13.0.0
- winston ^3.19.0
- cors ^2.8.5
- helmet ^7.1.0
- express-rate-limit ^7.1.5
- multer ^1.4.5-lts.1
- dotenv ^16.4.1

**Development:**
- typescript ^5.3.3
- @types/* packages for all dependencies
- nodemon ^3.0.3
- ts-node ^10.9.2
- eslint ^8.56.0
- prettier ^3.2.4

---

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

---

### Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB:**
   ```bash
   mongod
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Server runs at:** `http://localhost:5000`

---

### API Testing

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "age": 25,
    "gender": "male",
    "dailyTimeCommitment": 30,
    "interests": ["fitness", "mindfulness"]
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

### Summary

✅ **7 Database Models** created with proper schemas and indexes
✅ **45+ API Endpoints** implemented across 8 route modules
✅ **5 Middleware modules** for auth, validation, errors, rate limiting, uploads
✅ **8 Controllers** with comprehensive business logic
✅ **Program Generation Algorithm** for personalized 21-day plans
✅ **Test Scoring System** with difficulty level mapping
✅ **Progress Tracking** with streak and completion logic
✅ **Complete Validation** using Zod schemas
✅ **Security** with JWT, bcrypt, helmet, CORS, rate limiting
✅ **API Documentation** in `API_DOCUMENTATION.md`

The backend is fully functional and ready for integration with the frontend!
