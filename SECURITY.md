# Security Measures

## Overview

This application implements multiple layers of security to protect against common web vulnerabilities and API abuse.

## Security Layers

### 1. Input Validation & Sanitization

**Implementation:**
```javascript
// Backend validation
if (!question || typeof question !== 'string') {
  return res.status(400).json({ error: 'Invalid question' });
}

const sanitizedQuestion = question.trim();
if (sanitizedQuestion.length === 0) {
  return res.status(400).json({ error: 'Question cannot be empty' });
}

if (sanitizedQuestion.length > 1000) {
  return res.status(400).json({ error: 'Question too long' });
}
```

**Protects Against:**
- Injection attacks
- Empty/malformed requests
- Excessively large inputs
- Type confusion attacks

---

### 2. Rate Limiting

**Implementation:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

**Protects Against:**
- DDoS attacks
- API abuse
- Brute force attempts
- Resource exhaustion
- Groq API quota depletion

**Configuration:**
- Window: 15 minutes
- Max requests: 100 per IP
- Applies to all `/api/*` endpoints

---

### 3. CORS (Cross-Origin Resource Sharing)

**Implementation:**
```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
```

**Protects Against:**
- Unauthorized cross-origin requests
- CSRF attacks
- Data theft from other domains

**Configuration:**
- Development: `http://localhost:5173`
- Production: Vercel frontend URL
- Only POST and GET methods allowed
- No credentials sharing

---

### 4. HTTP Security Headers (Helmet)

**Implementation:**
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true
}));
```

**Headers Set:**
- `Content-Security-Policy` - Prevents XSS
- `Strict-Transport-Security` - Forces HTTPS
- `X-Frame-Options` - Prevents clickjacking
- `X-Content-Type-Options` - Prevents MIME sniffing
- `X-XSS-Protection` - Browser XSS filter

**Protects Against:**
- Cross-Site Scripting (XSS)
- Clickjacking
- MIME type attacks
- Man-in-the-middle attacks

---

### 5. Environment Variable Protection

**Implementation:**
```javascript
// .env file (never committed)
GROQ_API_KEY=your_key_here
MONGODB_URI=your_connection_string
PORT=3000
NODE_ENV=production

// Validation on startup
if (!process.env.GROQ_API_KEY) {
  console.error('GROQ_API_KEY is required');
  process.exit(1);
}
```

**Best Practices:**
- `.env` in `.gitignore`
- `.env.example` for documentation
- Validation on application start
- Different keys for dev/prod
- Vercel environment variables for production

**Protects Against:**
- API key exposure
- Credential leaks
- Unauthorized access

---

### 6. Request Size Limiting

**Implementation:**
```javascript
app.use(express.json({ 
  limit: '100kb',
  strict: true 
}));
```

**Protects Against:**
- Memory exhaustion
- Buffer overflow attacks
- Large payload DoS

**Limits:**
- Max JSON payload: 100kb
- Strict JSON parsing
- Rejects malformed JSON

---

### 7. Error Handling

**Implementation:**
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log for debugging
  
  // Don't expose internal errors
  res.status(500).json({
    error: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR'
  });
});

// Specific error handling
try {
  // API call
} catch (error) {
  if (error.response?.status === 429) {
    return res.status(429).json({ 
      error: 'AI service rate limit reached' 
    });
  }
  
  return res.status(500).json({ 
    error: 'Failed to get AI response' 
  });
}
```

**Protects Against:**
- Information disclosure
- Stack trace leaks
- System detail exposure

**Principles:**
- User-friendly messages only
- Technical details logged server-side
- Consistent error format
- No stack traces in production

---

### 8. MongoDB Security

**Implementation:**
```javascript
// Connection with security options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Schema validation
const conversationSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: true,
    maxlength: 1000 
  },
  answer: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});
```

**Security Features:**
- Encrypted connections (TLS)
- MongoDB Atlas IP whitelist
- Database user authentication
- Schema validation
- No raw queries (Mongoose ODM)

**Protects Against:**
- SQL/NoSQL injection
- Unauthorized database access
- Data tampering
- Connection hijacking

---

### 9. API Key Security

**Groq API Key Protection:**
```javascript
// Backend only - never exposed to frontend
const Groq = require('groq-sdk');
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Frontend makes requests to backend, not directly to Groq
```

**Best Practices:**
- API key only in backend
- Never in frontend code
- Never in Git repository
- Rotated periodically
- Separate keys for dev/prod

**Protects Against:**
- API key theft
- Unauthorized API usage
- Quota exhaustion
- Cost overruns

---

### 10. HTTPS Enforcement

**Implementation:**
- Vercel provides automatic HTTPS
- HSTS header forces HTTPS
- No HTTP fallback in production

**Configuration:**
```javascript
// Redirect HTTP to HTTPS (if needed)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

**Protects Against:**
- Man-in-the-middle attacks
- Data interception
- Session hijacking

---

## Security Checklist

- [x] Input validation and sanitization
- [x] Rate limiting implemented
- [x] CORS properly configured
- [x] Security headers (Helmet)
- [x] Environment variables protected
- [x] Request size limits
- [x] Error messages sanitized
- [x] HTTPS enforced
- [x] API keys secured
- [x] Database connections encrypted
- [x] No sensitive data in logs
- [x] Dependencies regularly updated

---

## Vulnerability Prevention

### XSS (Cross-Site Scripting)
**Prevention:**
- Content Security Policy
- Input sanitization
- React's built-in XSS protection
- No `dangerouslySetInnerHTML`

### CSRF (Cross-Site Request Forgery)
**Prevention:**
- CORS restrictions
- No cookies/sessions used
- Stateless API design

### Injection Attacks
**Prevention:**
- Input validation
- Mongoose parameterized queries
- Type checking
- Length limits

### DDoS (Distributed Denial of Service)
**Prevention:**
- Rate limiting
- Request size limits
- Vercel's DDoS protection
- MongoDB Atlas protection

### Man-in-the-Middle
**Prevention:**
- HTTPS only
- HSTS headers
- Encrypted database connections

---

## Security Testing

### Manual Testing
- [ ] Test rate limiting with rapid requests
- [ ] Try SQL/NoSQL injection patterns
- [ ] Test with oversized payloads
- [ ] Verify CORS blocks unauthorized origins
- [ ] Check error messages don't leak info

### Automated Testing
- [ ] npm audit for vulnerabilities
- [ ] Dependency scanning
- [ ] OWASP ZAP scanning
- [ ] Security headers validation

---

## Monitoring & Logging

**What to Log:**
- Failed authentication attempts
- Rate limit violations
- API errors
- Database connection issues

**What NOT to Log:**
- API keys
- User passwords (N/A for this app)
- Full request bodies
- Sensitive user data

---

## Incident Response

**If Security Issue Detected:**
1. Rotate API keys immediately
2. Review logs for breach extent
3. Update vulnerable dependencies
4. Deploy security patches
5. Monitor for continued attacks

---

## Security Updates

**Regular Maintenance:**
- Weekly: `npm audit` check
- Monthly: Dependency updates
- Quarterly: Security review
- As needed: Patch critical vulnerabilities

**Commands:**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update dependencies
npm update
```

---

## Compliance

**Data Protection:**
- No personal data collected
- No user authentication required
- Questions/answers stored anonymously
- No tracking or analytics

**GDPR Considerations:**
- Minimal data collection
- No user identification
- Data can be deleted on request

---

## Future Security Enhancements

If scaling the application:
- [ ] Implement authentication (JWT)
- [ ] Add request signing
- [ ] Implement API versioning
- [ ] Add security monitoring (Sentry)
- [ ] Implement WAF (Web Application Firewall)
- [ ] Add honeypot endpoints
- [ ] Implement CAPTCHA for abuse prevention
- [ ] Add audit logging
- [ ] Implement data encryption at rest
