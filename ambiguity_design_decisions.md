# Ambiguities & Design Decisions

## Questions to Resolve

### 1. Tech Stack Choices
**Question:** Backend runtime?
- [ ] Bun (recommended - faster, modern)
- [ ] Node.js (traditional, more stable)

**Question:** Frontend package manager?
- [ ] Bun (recommended - faster)
- [ ] npm (traditional)

**Your Choice:**
```
[Answer here]
`Node.js,npm``

---

### 2. MongoDB Schema Design
**Question:** What data should we store for each Q&A?

Minimal:
- question (string)
- response (string)

Enhanced:
- question (string)
- response (string)
- timestamp (Date)
- sessionId (string, optional)
- responseTime (number, ms)

**Your Choice:**
```
[Answer here]
```The enhanced version

---

### 3. Security Practices
**Question:** Which security measures to implement?

Options:
- [ ] Rate limiting (prevent API abuse)
- [ ] Input sanitization (prevent injection attacks)
- [ ] CORS configuration (restrict origins)
- [ ] Environment variable validation
- [ ] Request size limits
- [ ] API key protection

**Your Choice:**
```
[Answer here]
```
ALl
---

### 4. Groq API Configuration
**Question:** Do you have a Groq API key?
- [ ] Yes, I have it
- [ ] No, need to create one

**Question:** API parameters?
```
temperature: [0.0-1.0, default 0.7]
max_tokens: [number, default 1024]
top_p: [0.0-1.0, default 1.0]
```

**Your Choice:**
```
[Answer here]
```I use grok free version,I think I have to create one if it doesn't ask for subscription

---

### 5. UI Design Preferences
**Question:** Design style?
- [ ] Minimal/Clean (recommended for evaluation)
- [ ] Modern/Gradient
- [ ] Professional/Corporate

**Question:** Theme?
- [ ] Light mode only
- [ ] Dark mode only
- [ ] Both (toggle)

**Your Choice:**
```
[Answer here]
```Both

---

### 6. Error Handling
**Question:** How to handle errors?
- [ ] Show user-friendly messages
- [ ] Show technical error details
- [ ] Log errors to console only
- [ ] Store errors in MongoDB

**Your Choice:**
```
[Answer here]
```

---user-friendly messages

### 7. API Endpoint Structure
**Question:** Preferred API structure?

Option A (Simple):
```
POST /api/query
Body: { question: "..." }
Response: { answer: "..." }
```

Option B (Detailed):
```
POST /api/chat
Body: { question: "..." }
Response: { 
  question: "...",
  answer: "...",
  timestamp: "...",
  id: "..."
}
```

**Your Choice:**
```
[Answer here]
```B

---

### 8. Docker (Optional)
**Question:** Do you want to implement Docker?
- [ ] Yes, Dockerize both frontend and backend
- [ ] No, skip Docker (focus on core requirements)

**Your Choice:**
```
[Answer here]
```
Yes
---

## Design Decisions Made

### Decision 1: [Title]
**Context:**
```
[Describe the situation]
```

**Options Considered:**
1. Option A - [description]
2. Option B - [description]

**Decision:**
```
[Your final decision]
```

**Rationale:**
```
[Why you chose this]
```

---

### Decision 2: [Title]
**Context:**
```
[Describe the situation]
```

**Options Considered:**
1. Option A - [description]
2. Option B - [description]

**Decision:**
```
[Your final decision]
```

**Rationale:**
```
[Why you chose this]
```

---

## Notes
- Add more decisions as the project evolves
- Document trade-offs and constraints
- Reference this file in main README
