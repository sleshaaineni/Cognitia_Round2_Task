# Design Decisions

## Core Architecture Decisions

### Decision 1: Single Q&A vs. Continuous Chat

**Context:**
Requirements explicitly state "single question → single response" with no continuous chat history.

**Options Considered:**
1. Implement full chat with history (more features)
2. Single Q&A only (requirements-compliant)

**Decision:** Single Q&A model

**Rationale:**
- Aligns with project requirements
- Simpler architecture
- Easier to test and debug
- No extra marks for additional features
- Reduces complexity in state management

**Implementation:**
- Form resets after each response
- No conversation context maintained
- Each query is independent

---

### Decision 2: Node.js + npm vs. Bun

**Context:**
Requirements allow either Bun or Node.js. Bun is faster but newer.

**Options Considered:**
1. Bun - Modern, faster, all-in-one
2. Node.js + npm - Stable, proven, widely supported

**Decision:** Node.js with npm

**Rationale:**
- Better Vercel compatibility
- More stable for production
- Larger community and resources
- Fewer potential deployment issues
- npm has universal package support

**Trade-offs:**
- Slightly slower than Bun
- More configuration needed
- But: Reliability > Speed for this project

---

### Decision 3: MongoDB Schema Design

**Context:**
Need to store Q&A pairs. Question: How much metadata to include?

**Options Considered:**

**Option A (Minimal):**
```javascript
{
  question: String,
  answer: String
}
```

**Option B (Enhanced):**
```javascript
{
  question: String,
  answer: String,
  timestamp: Date,
  sessionId: String,
  responseTime: Number
}
```

**Decision:** Enhanced schema (Option B)

**Rationale:**
- Timestamps enable analytics
- SessionId allows future grouping
- ResponseTime helps monitor performance
- Minimal storage overhead
- Better for debugging and monitoring

**Implementation:**
```javascript
const conversationSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sessionId: { type: String },
  responseTime: { type: Number }
});
```

---

### Decision 4: API Endpoint Structure

**Context:**
Need to design API contract between frontend and backend.

**Options Considered:**

**Option A (Simple):**
```javascript
POST /api/query
Request: { question: "..." }
Response: { answer: "..." }
```

**Option B (Detailed):**
```javascript
POST /api/chat
Request: { question: "..." }
Response: { 
  question: "...",
  answer: "...",
  timestamp: "...",
  id: "..."
}
```

**Decision:** Detailed response (Option B)

**Rationale:**
- Frontend can display timestamp
- ID enables future features (like history)
- Echo question for validation
- Better debugging
- More professional API design

---

### Decision 5: Security Implementation

**Context:**
Need to protect API from abuse and attacks.

**Security Measures Implemented:**

1. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Prevents API abuse
   - Protects Groq API quota

2. **Input Sanitization**
   - Trim whitespace
   - Validate non-empty
   - Limit input length

3. **CORS Configuration**
   - Restrict to frontend domain
   - Prevent unauthorized access
   - Different configs for dev/prod

4. **Helmet.js**
   - Security headers
   - XSS protection
   - Content Security Policy

5. **Environment Variables**
   - API keys never in code
   - Separate dev/prod configs
   - Validation on startup

6. **Request Size Limits**
   - Max 100kb payload
   - Prevents memory attacks

**Decision:** Implement all measures

**Rationale:**
- Security is evaluation criteria
- Minimal performance impact
- Industry best practices
- Protects free API quotas

---

### Decision 6: UI Theme Implementation

**Context:**
Modern applications often support dark mode.

**Options Considered:**
1. Light mode only
2. Dark mode only
3. Both with toggle

**Decision:** Both modes with toggle

**Rationale:**
- Better user experience
- Shows attention to detail
- Simple to implement with CSS variables
- No extra marks but demonstrates quality

**Implementation:**
```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}
```

---

### Decision 7: Error Handling Strategy

**Context:**
Multiple failure points: network, API, database.

**Options Considered:**
1. Show technical errors to users
2. Show user-friendly messages only
3. Mix of both based on error type

**Decision:** User-friendly messages only

**Rationale:**
- Better UX
- Doesn't expose system details
- Security best practice
- Technical errors logged server-side

**Error Categories:**
- Network errors → "Connection failed"
- API errors → "AI service unavailable"
- Validation errors → Specific guidance
- Server errors → "Something went wrong"

---

### Decision 8: Groq API Configuration

**Context:**
Groq API has multiple configuration parameters.

**Configuration Chosen:**
```javascript
{
  model: "llama-3.1-8b-instant",
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 1.0
}
```

**Rationale:**
- **Model:** Required by project specs
- **Temperature 0.7:** Balanced creativity/accuracy
- **Max tokens 1024:** Sufficient for most answers
- **Top_p 1.0:** Full vocabulary access

**Alternatives Considered:**
- Lower temperature (0.3): Too deterministic
- Higher temperature (0.9): Too random
- Fewer tokens (512): Might truncate answers

---

### Decision 9: Deployment Strategy

**Context:**
Requirements specify separate Vercel deployments for frontend and backend.

**Strategy:**
1. Single GitHub repository
2. Two separate Vercel projects
3. Frontend points to backend URL
4. Environment variables for configuration

**Decision:** Separate deployments, single repo

**Rationale:**
- Meets requirements exactly
- Independent scaling
- Separate deployment pipelines
- Clear separation of concerns

**Configuration:**
- Frontend: `VITE_API_URL` environment variable
- Backend: Standalone serverless functions
- CORS configured for frontend domain

---

### Decision 10: Docker Implementation

**Context:**
Docker is optional but demonstrates DevOps knowledge.

**Options Considered:**
1. Skip Docker (focus on core requirements)
2. Dockerize both services
3. Docker Compose for local development

**Decision:** Implement Docker (optional)

**Rationale:**
- Shows additional technical skill
- Useful for local development
- Easy to set up
- Doesn't interfere with Vercel deployment

**Implementation:**
- Dockerfile for frontend
- Dockerfile for backend
- docker-compose.yml for orchestration
- .dockerignore for optimization

---

### Decision 11: State Management

**Context:**
Frontend needs to manage loading, errors, and response state.

**Options Considered:**
1. Redux/Zustand (state management library)
2. React Context API
3. Component state (useState)

**Decision:** Component state only

**Rationale:**
- Simple application scope
- No shared state between components
- Avoids unnecessary complexity
- Faster development

**State Managed:**
- `question` - User input
- `answer` - AI response
- `loading` - Request in progress
- `error` - Error messages
- `theme` - Light/dark mode

---

### Decision 12: Code Organization

**Context:**
Need clear project structure for maintainability.

**Structure Chosen:**
```
frontend/
├── src/
│   ├── components/
│   ├── services/
│   ├── styles/
│   └── App.jsx
└── public/

backend/
├── src/
│   ├── routes/
│   ├── config/
│   └── server.js
└── models/
```

**Rationale:**
- Clear separation of concerns
- Easy to navigate
- Scalable structure
- Industry standard patterns

---

## Trade-offs Summary

| Decision | Chosen | Alternative | Trade-off |
|----------|--------|-------------|-----------|
| Runtime | Node.js | Bun | Stability > Speed |
| Schema | Enhanced | Minimal | Features > Simplicity |
| Security | All measures | Basic only | Safety > Performance |
| Theme | Both modes | Single | UX > Simplicity |
| State | Component | Redux | Simplicity > Scalability |
| Docker | Included | Skipped | Learning > Time |

## Lessons Learned

1. **Requirements First:** Stick to specs, avoid feature creep
2. **Security Matters:** Implement from the start, not as afterthought
3. **Documentation:** Clear decisions help future maintenance
4. **Simplicity:** Choose simple solutions for simple problems
5. **Deployment:** Test early and often

## Future Considerations

If expanding beyond current scope:
- Add conversation history
- Implement user authentication
- Add response streaming
- Implement caching layer
- Add analytics dashboard
- Support multiple AI models
