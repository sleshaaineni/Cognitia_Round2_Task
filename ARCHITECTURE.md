# System Architecture

## Overview

This application follows a three-tier architecture with clear separation between presentation, business logic, and data layers.

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │─────▶│   Frontend  │─────▶│   Backend   │─────▶│  Groq API   │
│   (Client)  │◀─────│   (React)   │◀─────│  (Express)  │◀─────│   (LLM)     │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │  MongoDB    │
                                           │   Atlas     │
                                           └─────────────┘
```

## Component Architecture

### Frontend Layer (React + Vite)

**Components:**
- `App.jsx` - Root component with theme management
- `ChatInterface.jsx` - Main UI for question input and answer display
- `ThemeToggle.jsx` - Light/dark mode switcher

**Responsibilities:**
- User input collection
- API request handling
- Response rendering
- Theme state management
- Error display

**Data Flow:**
1. User enters question
2. Submit triggers API call via Axios
3. Loading state displayed
4. Response rendered or error shown
5. Form reset for next query

### Backend Layer (Node.js + Express)

**Structure:**
```
backend/
├── src/
│   ├── server.js          # Entry point, middleware setup
│   ├── routes/
│   │   └── chat.js        # Chat endpoint logic
│   └── config/
│       └── db.js          # MongoDB connection
└── models/
    └── Conversation.js    # Mongoose schema
```

**Middleware Stack:**
1. `helmet` - Security headers
2. `cors` - Cross-origin configuration
3. `express.json()` - JSON parsing
4. `express-rate-limit` - Request throttling
5. Custom error handler

**Responsibilities:**
- Request validation
- Groq API integration
- Database operations
- Error handling
- Security enforcement

### Data Layer (MongoDB Atlas)

**Schema Design:**
```javascript
{
  question: String,      // User query
  answer: String,        // AI response
  timestamp: Date,       // Creation time
  sessionId: String,     // Optional session tracking
  responseTime: Number   // API response duration (ms)
}
```

**Indexes:**
- `timestamp` (descending) - Query recent conversations
- `sessionId` - Optional session-based queries

## Data Flow

### Request Flow

```
1. User Input
   └─▶ Frontend validates non-empty question
       └─▶ POST /api/chat with { question }
           └─▶ Backend rate limit check
               └─▶ Input sanitization
                   └─▶ Groq API call
                       └─▶ MongoDB save
                           └─▶ Response to frontend
```

### Response Flow

```
1. Groq API Response
   └─▶ Extract answer text
       └─▶ Create DB record
           └─▶ Format response object
               └─▶ Send to frontend
                   └─▶ Display to user
```

## API Integration

### Groq API

**Configuration:**
```javascript
{
  model: "llama-3.1-8b-instant",
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 1.0
}
```

**Request Format:**
```javascript
{
  messages: [
    { role: "user", content: userQuestion }
  ]
}
```

**Error Handling:**
- Network failures → Retry logic
- Rate limits → User-friendly message
- Invalid responses → Fallback error

## Security Architecture

### Defense Layers

1. **Input Layer**
   - Request size limits (100kb)
   - Input sanitization
   - Type validation

2. **Network Layer**
   - CORS restrictions
   - Rate limiting (100 req/15min)
   - Helmet security headers

3. **Application Layer**
   - Environment variable validation
   - API key protection
   - Error message sanitization

4. **Data Layer**
   - MongoDB connection encryption
   - No sensitive data storage
   - Parameterized queries (Mongoose)

## Deployment Architecture

### Production Setup

```
┌──────────────────────────────────────────────────────┐
│                    Vercel CDN                        │
│  ┌────────────────┐         ┌────────────────┐     │
│  │   Frontend     │         │    Backend     │     │
│  │  (Static SPA)  │         │  (Serverless)  │     │
│  └────────────────┘         └────────────────┘     │
└──────────────────────────────────────────────────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │  MongoDB     │
                              │   Atlas      │
                              │  (Cloud DB)  │
                              └──────────────┘
```

**Characteristics:**
- Frontend: Static hosting with CDN
- Backend: Serverless functions
- Database: Managed cloud service
- Zero server management

## Scalability Considerations

### Current Design
- Stateless backend (horizontal scaling ready)
- MongoDB Atlas auto-scaling
- Vercel edge network distribution
- Rate limiting prevents abuse

### Future Enhancements
- Redis caching for frequent queries
- Database connection pooling
- Response compression
- CDN for static assets

## Error Handling Strategy

### Error Types

1. **Client Errors (4xx)**
   - 400: Invalid input
   - 429: Rate limit exceeded

2. **Server Errors (5xx)**
   - 500: Groq API failure
   - 503: Database unavailable

### Error Response Format
```javascript
{
  error: "User-friendly message",
  code: "ERROR_CODE",
  timestamp: "ISO-8601"
}
```

## Performance Optimization

- Minimal dependencies
- Lazy loading (future)
- Database indexing
- Connection reuse
- Response streaming (future)

## Monitoring & Logging

**Current:**
- Console logging for development
- Error tracking in production

**Recommended:**
- Vercel Analytics
- MongoDB Atlas monitoring
- Error tracking service (Sentry)
- API response time metrics
