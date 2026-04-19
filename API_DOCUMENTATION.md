# API Documentation

## Base URL

**Development:** `http://localhost:3000`  
**Production:** `https://your-backend.vercel.app`

## Endpoints

### POST /api/chat

Send a question to the AI assistant and receive a response.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "question": "What is artificial intelligence?"
}
```

**Parameters:**

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| question | string | Yes | User's question | 1-1000 characters, non-empty after trim |

#### Response

**Success (200 OK):**
```json
{
  "question": "What is artificial intelligence?",
  "answer": "Artificial intelligence (AI) refers to the simulation of human intelligence in machines...",
  "timestamp": "2026-04-19T14:47:43.383Z",
  "id": "662a1b3c4d5e6f7g8h9i0j1k"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| question | string | Echo of the user's question |
| answer | string | AI-generated response |
| timestamp | string (ISO 8601) | When the response was created |
| id | string | MongoDB document ID |

#### Error Responses

**400 Bad Request - Missing Question:**
```json
{
  "error": "Question is required"
}
```

**400 Bad Request - Invalid Type:**
```json
{
  "error": "Invalid question"
}
```

**400 Bad Request - Empty Question:**
```json
{
  "error": "Question cannot be empty"
}
```

**400 Bad Request - Too Long:**
```json
{
  "error": "Question too long"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many requests, please try again later"
}
```

**500 Internal Server Error - AI Service:**
```json
{
  "error": "Failed to get AI response"
}
```

**500 Internal Server Error - Database:**
```json
{
  "error": "Failed to save conversation"
}
```

**503 Service Unavailable:**
```json
{
  "error": "AI service temporarily unavailable"
}
```

---

### GET /health

Health check endpoint to verify API is running.

#### Request

No parameters required.

#### Response

**Success (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-04-19T14:47:43.383Z"
}
```

---

## Rate Limiting

**Limits:**
- 100 requests per 15 minutes per IP address
- Applies to all `/api/*` endpoints

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1713529663
```

**When Exceeded:**
- Status: 429 Too Many Requests
- Retry after 15 minutes
- Reset time provided in headers

---

## CORS Policy

**Allowed Origins:**
- Development: `http://localhost:5173`
- Production: Your Vercel frontend URL

**Allowed Methods:**
- GET
- POST

**Allowed Headers:**
- Content-Type

---

## Request Examples

### cURL

```bash
curl -X POST https://your-backend.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is machine learning?"}'
```

### JavaScript (Fetch)

```javascript
const response = await fetch('https://your-backend.vercel.app/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'What is machine learning?'
  })
});

const data = await response.json();
console.log(data.answer);
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const response = await axios.post('https://your-backend.vercel.app/api/chat', {
  question: 'What is machine learning?'
});

console.log(response.data.answer);
```

### Python (Requests)

```python
import requests

response = requests.post(
    'https://your-backend.vercel.app/api/chat',
    json={'question': 'What is machine learning?'}
)

data = response.json()
print(data['answer'])
```

---

## Error Handling

### Client-Side Error Handling

```javascript
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  const data = await response.json();
  return data;
  
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Handle rate limiting
  } else if (error.message.includes('network')) {
    // Handle network errors
  } else {
    // Handle other errors
  }
}
```

---

## Response Times

**Typical Response Times:**
- Fast queries: 500ms - 2s
- Complex queries: 2s - 5s
- Under load: 5s - 10s

**Timeout Recommendations:**
- Client timeout: 30 seconds
- Display loading state after 1 second

---

## Data Storage

### What Gets Stored

Every successful request stores:
```javascript
{
  question: "User's question",
  answer: "AI response",
  timestamp: Date,
  sessionId: String (optional),
  responseTime: Number (ms)
}
```

### What Doesn't Get Stored

- User IP addresses
- User identifiers
- Request headers
- Failed requests
- Rate-limited requests

---

## Security

### Authentication

Currently: **None required**

Future: May implement API keys for production use.

### Input Sanitization

All inputs are:
- Trimmed of whitespace
- Validated for type
- Checked for length
- Sanitized for special characters

### Output Sanitization

All responses are:
- Validated before sending
- Stripped of sensitive data
- Formatted consistently

---

## Groq API Integration

### Model Configuration

```javascript
{
  model: "llama-3.1-8b-instant",
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 1.0
}
```

### Model Behavior

- **Temperature 0.7:** Balanced creativity and accuracy
- **Max tokens 1024:** Sufficient for detailed answers
- **Top_p 1.0:** Full vocabulary access

### Groq API Limits

- Free tier: Generous limits
- Rate limiting: Handled by backend
- Errors: Gracefully handled and reported

---

## Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server/AI error |
| 503 | Service Unavailable | AI service down |

---

## Versioning

**Current Version:** v1 (implicit)

**Future Versioning:**
- `/api/v1/chat`
- `/api/v2/chat`

Currently no version prefix as this is the initial release.

---

## Monitoring

### Health Checks

Use `/health` endpoint for:
- Uptime monitoring
- Load balancer health checks
- Deployment verification

### Metrics to Track

- Request count
- Response times
- Error rates
- Rate limit hits

---

## Best Practices

### Client Implementation

1. **Always handle errors:**
   ```javascript
   try {
     const data = await apiCall();
   } catch (error) {
     showErrorMessage(error);
   }
   ```

2. **Show loading states:**
   ```javascript
   setLoading(true);
   const data = await apiCall();
   setLoading(false);
   ```

3. **Validate before sending:**
   ```javascript
   if (!question.trim()) {
     return showError('Question required');
   }
   ```

4. **Respect rate limits:**
   - Don't retry immediately on 429
   - Implement exponential backoff
   - Show user-friendly messages

5. **Set reasonable timeouts:**
   ```javascript
   const controller = new AbortController();
   setTimeout(() => controller.abort(), 30000);
   
   fetch(url, { signal: controller.signal });
   ```

---

## Testing

### Test Cases

**Valid Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello"}'
```

**Empty Question:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": ""}'
```

**Missing Question:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Rate Limit Test:**
```bash
for i in {1..101}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"question": "Test"}' &
done
```

---

## Changelog

### v1.0.0 (2026-04-19)
- Initial release
- POST /api/chat endpoint
- GET /health endpoint
- Rate limiting
- Error handling
- MongoDB integration
- Groq API integration

---

## Support

For issues or questions:
- Check error messages
- Review this documentation
- Check application logs
- Contact repository owner

---

## Future Enhancements

Planned features:
- [ ] GET /api/history - Retrieve past conversations
- [ ] DELETE /api/conversation/:id - Delete specific conversation
- [ ] POST /api/feedback - Submit feedback on responses
- [ ] WebSocket support for streaming responses
- [ ] API key authentication
- [ ] Request/response compression
