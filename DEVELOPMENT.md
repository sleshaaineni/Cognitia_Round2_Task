# Development Guide

## Local Development Setup

### Prerequisites

Ensure you have installed:
- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git
- Code editor (VS Code recommended)

### Verify Installation

```bash
node --version  # Should be v18+
npm --version   # Should be 9+
git --version
```

---

## Initial Setup

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd Cognitia_Round2_Task
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

**Backend .env file:**
```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env
nano .env
```

**Frontend .env file:**
```env
VITE_API_URL=http://localhost:3000
```

---

## Running the Application

### Option 1: Run Both Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Using Concurrently (Optional)

Install concurrently in project root:
```bash
npm install -g concurrently
```

Create `package.json` in project root:
```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "install-all": "cd backend && npm install && cd ../frontend && npm install"
  }
}
```

Run both:
```bash
npm run dev
```

---

## Development Workflow

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test locally:**
   - Backend: `http://localhost:3000`
   - Frontend: `http://localhost:5173`

4. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   ```

5. **Push to repository:**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Project Structure

```
Cognitia_Round2_Task/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── chat.js
│   │   ├── config/
│   │   │   └── db.js
│   │   └── server.js
│   ├── models/
│   │   └── Conversation.js
│   ├── package.json
│   └── .env
│
├── docs/
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── TECH_STACK.md
│   └── ...
│
├── .gitignore
└── README.md
```

---

## Backend Development

### File Structure

**server.js** - Main entry point
```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/chat', chatRoutes);

// Start server
app.listen(PORT);
```

**routes/chat.js** - Chat endpoint logic
```javascript
router.post('/', async (req, res) => {
  // 1. Validate input
  // 2. Call Groq API
  // 3. Save to MongoDB
  // 4. Return response
});
```

**models/Conversation.js** - MongoDB schema
```javascript
const conversationSchema = new mongoose.Schema({
  question: String,
  answer: String,
  timestamp: Date
});
```

### Adding New Endpoints

1. Create route file in `src/routes/`
2. Define route logic
3. Import in `server.js`
4. Test with curl or Postman

Example:
```javascript
// src/routes/history.js
router.get('/', async (req, res) => {
  const conversations = await Conversation.find()
    .sort({ timestamp: -1 })
    .limit(10);
  res.json(conversations);
});
```

### Testing Backend

**Manual Testing:**
```bash
# Health check
curl http://localhost:3000/health

# Chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Test question"}'
```

**Using Postman:**
1. Create new request
2. Method: POST
3. URL: `http://localhost:3000/api/chat`
4. Body: JSON `{"question": "Test"}`
5. Send

---

## Frontend Development

### File Structure

**App.jsx** - Root component
```javascript
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <div data-theme={theme}>
      <ThemeToggle />
      <ChatInterface />
    </div>
  );
}
```

**components/ChatInterface.jsx** - Main UI
```javascript
function ChatInterface() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    // API call logic
  };
  
  return (/* JSX */);
}
```

**services/api.js** - API calls
```javascript
export const sendQuestion = async (question) => {
  const response = await axios.post(
    `${API_URL}/api/chat`,
    { question }
  );
  return response.data;
};
```

### Adding New Components

1. Create file in `src/components/`
2. Define component
3. Import in parent component
4. Add styles in CSS file

Example:
```javascript
// src/components/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return <div className="spinner">Loading...</div>;
}
```

### Styling

**CSS Variables for Theming:**
```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --primary-color: #007bff;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --primary-color: #4da6ff;
}
```

---

## Debugging

### Backend Debugging

**Console Logging:**
```javascript
console.log('Request received:', req.body);
console.error('Error occurred:', error);
```

**VS Code Debugger:**

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/backend/src/server.js",
      "envFile": "${workspaceFolder}/backend/.env"
    }
  ]
}
```

### Frontend Debugging

**Browser DevTools:**
- Console: View logs and errors
- Network: Inspect API calls
- React DevTools: Inspect component state

**Console Logging:**
```javascript
console.log('State:', { question, answer, loading });
console.error('API Error:', error);
```

---

## Common Issues

### Backend Won't Start

**Issue:** Port already in use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### MongoDB Connection Failed

**Issue:** Cannot connect to MongoDB
```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solutions:**
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Verify database user credentials
- Check if MongoDB service is running (local)

### Frontend Can't Reach Backend

**Issue:** Network error or CORS error

**Solutions:**
- Verify backend is running on port 3000
- Check `VITE_API_URL` in frontend .env
- Verify CORS is configured correctly
- Check browser console for specific error

### Groq API Errors

**Issue:** API key invalid or rate limit

**Solutions:**
- Verify API key is correct
- Check for extra spaces in .env
- Wait if rate limited
- Regenerate API key if needed

---

## Environment Variables

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| GROQ_API_KEY | Groq API key | gsk_... |
| MONGODB_URI | MongoDB connection | mongodb+srv://... |
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| FRONTEND_URL | Frontend URL | http://localhost:5173 |

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend URL | http://localhost:3000 |

**Note:** Vite requires `VITE_` prefix for environment variables.

---

## Git Workflow

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Branch Naming

```
feature/feature-name
bugfix/bug-description
hotfix/critical-fix
docs/documentation-update
```

### Example Workflow

```bash
# Create feature branch
git checkout -b feature/add-history

# Make changes and commit
git add .
git commit -m "feat: add conversation history endpoint"

# Push to remote
git push origin feature/add-history

# Create pull request on GitHub
# After review, merge to main
```

---

## Testing

### Manual Testing Checklist

**Backend:**
- [ ] Health endpoint responds
- [ ] Chat endpoint accepts valid questions
- [ ] Rejects empty questions
- [ ] Rejects too-long questions
- [ ] Rate limiting works
- [ ] Saves to MongoDB
- [ ] Returns correct response format

**Frontend:**
- [ ] Page loads without errors
- [ ] Can type in input field
- [ ] Submit button works
- [ ] Loading state displays
- [ ] Answer displays correctly
- [ ] Error messages show
- [ ] Theme toggle works
- [ ] Form resets after submission

### API Testing with curl

```bash
# Valid request
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is AI?"}'

# Empty question (should fail)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": ""}'

# Missing question (should fail)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Performance Optimization

### Backend

- Use connection pooling for MongoDB
- Implement caching for frequent queries
- Optimize database queries
- Use compression middleware

### Frontend

- Lazy load components
- Optimize images
- Minimize bundle size
- Use production build for deployment

---

## Code Quality

### Linting (Optional)

**Install ESLint:**
```bash
npm install --save-dev eslint
npx eslint --init
```

**Run linter:**
```bash
npm run lint
```

### Formatting (Optional)

**Install Prettier:**
```bash
npm install --save-dev prettier
```

**Format code:**
```bash
npx prettier --write .
```

---

## Useful Commands

### Backend

```bash
npm run dev          # Start development server
npm start            # Start production server
npm install          # Install dependencies
npm audit            # Check for vulnerabilities
npm audit fix        # Fix vulnerabilities
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm install          # Install dependencies
```

### Git

```bash
git status           # Check status
git log              # View commit history
git diff             # View changes
git stash            # Stash changes
git stash pop        # Apply stashed changes
```

---

## Resources

### Documentation
- [Node.js Docs](https://nodejs.org/docs)
- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [MongoDB Docs](https://docs.mongodb.com)
- [Groq Docs](https://console.groq.com/docs)

### Tools
- [Postman](https://www.postman.com) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code](https://code.visualstudio.com) - Code editor

---

## Next Steps

After local development:
1. Test thoroughly
2. Update documentation
3. Commit changes
4. Push to GitHub
5. Deploy to Vercel (see DEPLOYMENT.md)
