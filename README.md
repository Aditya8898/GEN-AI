# Interview AI - AI-Powered Interview Preparation Platform

An intelligent interview preparation system that analyzes resumes and job descriptions to generate personalized interview reports, practice questions, and preparation plans using Google's Gemini AI.

## 🚀 Features

### Core Functionality
- **AI-Powered Analysis**: Leverages Google Gemini 3.0 Flash for comprehensive interview report generation
- **Resume Processing**: Supports PDF resume uploads with automatic text extraction
- **Personalized Reports**: Generates match scores, technical questions, behavioral questions, skill gap analysis, and 7-day preparation plans
- **User Authentication**: Secure JWT-based authentication with user registration and login
- **Responsive UI**: Modern React frontend with SCSS styling

### Interview Report Components
- **Match Score**: 0-100 score indicating candidate-job fit
- **Technical Questions**: 5-10 role-specific questions with intentions and model answers
- **Behavioral Questions**: 3-5 soft skill assessment questions with guidance
- **Skill Gaps**: Identified gaps with severity levels (low/medium/high)
- **Preparation Plan**: Day-by-day 7-day study plan with actionable tasks
- **Job Title Extraction**: Automatic job title identification

## 🏗️ Architecture

### Backend (Node.js/Express)
```
backend/
├── server.js              # Main server entry point
├── src/
│   ├── app.js            # Express app configuration
│   ├── config/
│   │   └── database.js   # MongoDB connection
│   ├── controllers/      # Route handlers
│   │   ├── auth.controller.js
│   │   └── interview.controller.js
│   ├── middlewares/      # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── file.middleware.js
│   ├── models/           # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── interviewReport.model.js
│   │   └── blacklist.model.js
│   ├── routes/           # API routes
│   │   ├── auth.routes.js
│   │   └── interview.routes.js
│   └── services/
│       └── ai.service.js # Google Gemini integration
└── package.json
```

### Frontend (React/Vite)
```
frontend/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── app.routes.jsx
│   │   ├── features/
│   │   │   ├── auth/           # Authentication module
│   │   │   │   ├── pages/
│   │   │   │   │   ├── Login.jsx
│   │   │   │   │   └── Register.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.api.js
│   │   │   │   └── auth.context.jsx
│   │   │   └── interview/      # Interview module
│   │   │       ├── pages/
│   │   │       │   ├── Home.jsx
│   │   │       │   └── Interview.jsx
│   │   │       └── services/
│   │   │           └── interview.api.js
│   │   └── style/              # Global styles
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **AI Service**: Google Generative AI (Gemini 3.0 Flash)
- **File Processing**: Multer (file uploads) + pdf-parse
- **Validation**: Zod schema validation
- **CORS**: cors middleware

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: SCSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google AI API Key (for Gemini)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd interview-ai
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/interview-ai
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_GENAI_API_KEY=your-google-ai-api-key
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend/frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Interview Reports
- `POST /api/interview/` - Generate new interview report (multipart/form-data)
  - Fields: `jobDescription`, `selfDescription`, `resume` (PDF file)
- `GET /api/interview/` - Get all user's interview reports
- `GET /api/interview/:id` - Get specific interview report

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `GOOGLE_GENAI_API_KEY`: Google AI API key for Gemini

### File Upload Limits
- Maximum file size: 3MB
- Supported formats: PDF only
- Storage: Memory (processed and discarded after analysis)

## 🧪 Testing

### Manual Testing
1. Register a new user account
2. Login with credentials
3. Upload a PDF resume
4. Enter job description and self-description
5. Generate interview report
6. View results in tabs: Technical, Behavioral, Roadmap

### API Testing
Use tools like Postman or curl to test endpoints:
```bash
# Login example
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## 🔍 Troubleshooting

### Common Issues

**Empty Arrays in Report**
- Check AI service logs for raw responses
- Verify Google AI API key is valid
- Ensure resume PDF is text-extractable

**Authentication Errors**
- Verify JWT_SECRET is set
- Check token expiration (24 hours)
- Ensure cookies are enabled for frontend

**File Upload Issues**
- Confirm PDF is not corrupted
- Check file size limit (3MB)
- Verify pdf-parse can extract text

**Database Connection**
- Ensure MongoDB is running
- Verify MONGODB_URI format
- Check network connectivity

### Debug Mode
Enable detailed logging by checking server console output when generating reports.

## 🚀 Deployment

### Production Considerations
- Set `NODE_ENV=production`
- Use environment variables for all secrets
- Configure MongoDB replica set for production
- Implement rate limiting
- Add input sanitization
- Set up monitoring and logging
- Use HTTPS in production

### Docker Deployment (Future)
```dockerfile
# Example Dockerfile structure
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Generative AI for powering the interview analysis
- Open source community for the amazing tools and libraries
- Inspired by modern AI-driven interview preparation platforms

---

**Note**: This is an AI-powered tool for interview preparation. Results should be used as guidance, not as definitive assessments.</content>
<parameter name="filePath">c:\Users\aditya\OneDrive\Desktop\GEN-AI\README.md