# Implementation Plan

## Project Structure

```
Cognitia_Round2_Task/
├── backend/
│   ├── config/
│   │   └── db.js                 ✅ Done
│   ├── models/
│   │   └── Conversation.js       ✅ Done
│   ├── routes/
│   │   └── chat.js               ⏳ To do
│   ├── server.js                 ⏳ To do
│   ├── package.json              ⏳ To do
│   ├── .env                      ✅ Done
│   └── .env.example              ✅ Done
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx ⏳ To do
│   │   │   └── ThemeToggle.jsx   ⏳ To do
│   │   ├── services/
│   │   │   └── api.js            ⏳ To do
│   │   ├── App.jsx               ⏳ To do
│   │   ├── App.css               ⏳ To do
│   │   └── main.jsx              ⏳ To do
│   ├── index.html                ⏳ To do
│   ├── package.json              ⏳ To do
│   ├── vite.config.js            ⏳ To do
│   ├── .env                      ⏳ To do
│   └── .env.example              ✅ Done
│
├── .gitignore                    ⏳ To do
└── Documentation                 ✅ Done
```

---

## Implementation Phases

### **Phase 1: Backend Setup** (15 min)
- [ ] Create package.json with dependencies
- [ ] Install required packages
- [ ] Create Express server (server.js)
- [ ] Create chat route with Groq API integration
- [ ] Test backend with curl

### **Phase 2: Frontend Setup** (15 min)
- [ ] Initialize Vite React project
- [ ] Install dependencies
- [ ] Create basic App structure
- [ ] Create ChatInterface component
- [ ] Create ThemeToggle component
- [ ] Create API service
- [ ] Add styling

### **Phase 3: Integration & Testing** (10 min)
- [ ] Connect frontend to backend
- [ ] Test full flow locally
- [ ] Fix any bugs
- [ ] Test error handling

### **Phase 4: Final Touches** (5 min)
- [ ] Create .gitignore
- [ ] Clean up code
- [ ] Verify all documentation
- [ ] Commit to Git

---

## Detailed Implementation Steps

### Phase 1: Backend Implementation

#### Step 1.1: Create package.json
```bash
cd backend
npm init -y
```

#### Step 1.2: Install dependencies
```bash
npm install express mongoose groq-sdk dotenv cors helmet express-rate-limit
```

#### Step 1.3: Create server.js
- Initialize Express app
- Configure middleware (cors, helmet, rate limiting)
- Connect to MongoDB
- Set up routes
- Start server

#### Step 1.4: Create chat route
- POST /api/chat endpoint
- Validate input
- Call Groq API
- Save to MongoDB
- Return response

#### Step 1.5: Test backend
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is AI?"}'
```

---

### Phase 2: Frontend Implementation

#### Step 2.1: Initialize Vite project
```bash
cd frontend
npm create vite@latest . -- --template react
```

#### Step 2.2: Install dependencies
```bash
npm install axios
```

#### Step 2.3: Create component structure
- App.jsx (root component with theme)
- ChatInterface.jsx (main UI)
- ThemeToggle.jsx (light/dark mode)

#### Step 2.4: Create API service
- api.js with axios configuration
- sendQuestion function

#### Step 2.5: Add styling
- App.css with CSS variables
- Theme support (light/dark)
- Responsive design

---

### Phase 3: Integration & Testing

#### Step 3.1: Start both servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Step 3.2: Test full flow
- Open http://localhost:5173
- Submit a question
- Verify response displays
- Check MongoDB for saved data

#### Step 3.3: Test error cases
- Empty question
- Very long question
- Network error simulation
- Rate limiting (101 requests)

#### Step 3.4: Verify MongoDB storage
- Check MongoDB Atlas dashboard
- Verify conversations collection
- Check data structure

---

### Phase 4: Finalization

#### Step 4.1: Create .gitignore
```
node_modules/
.env
dist/
build/
.DS_Store
```

#### Step 4.2: Final testing checklist
- [ ] Backend health endpoint works
- [ ] Chat endpoint accepts questions
- [ ] Frontend loads without errors
- [ ] Can submit questions
- [ ] Receives AI responses
- [ ] Error handling works
- [ ] Theme toggle works
- [ ] Data saves to MongoDB
- [ ] Rate limiting works

#### Step 4.3: Git commit
```bash
git add .
git commit -m "feat: Complete full-stack AI assistant implementation"
git push origin main
```

---

## Time Estimate

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1: Backend | 15 min | Setup, routes, Groq integration |
| Phase 2: Frontend | 15 min | React components, styling |
| Phase 3: Integration | 10 min | Testing, debugging |
| Phase 4: Finalization | 5 min | Git, final checks |
| **Total** | **~45 min** | Complete implementation |

---

## Dependencies List

### Backend
```json
{
  "express": "^4.18.0",
  "mongoose": "^8.0.0",
  "groq-sdk": "^0.3.0",
  "dotenv": "^16.0.0",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.0"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0"
}
```

---

## API Endpoints

### Backend Endpoints

**Health Check:**
```
GET /health
Response: { status: "ok", timestamp: "..." }
```

**Chat:**
```
POST /api/chat
Body: { question: "..." }
Response: { question: "...", answer: "...", timestamp: "...", id: "..." }
```

---

## Environment Variables

### Backend (.env)
```env
GROQ_API_KEY=your_groq_key
MONGODB_URI=mongodb+srv://...
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

---

## Success Criteria

✅ Backend server runs on port 3000  
✅ Frontend runs on port 5173  
✅ Can submit questions and get AI responses  
✅ Data saves to MongoDB  
✅ Error handling works  
✅ Theme toggle works  
✅ Rate limiting prevents abuse  
✅ Security measures implemented  
✅ Code is clean and documented  
✅ Ready for deployment  

---

## Next Steps After Implementation

1. Test thoroughly locally
2. Commit to Git
3. Deploy backend to Vercel
4. Deploy frontend to Vercel
5. Update CORS and environment variables
6. Final production testing

---

## Notes

- Keep code minimal and focused
- Follow requirements exactly (single Q&A, no chat history)
- Prioritize security and error handling
- Document as you go
- Test each phase before moving to next

---

**Status:** Ready to begin Phase 1 - Backend Setup
**Last Updated:** 2026-04-19
