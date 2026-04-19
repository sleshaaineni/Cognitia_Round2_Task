# Testing Checklist

## Backend Tests

### Health Endpoint
```bash
curl http://localhost:3000/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### Chat Endpoint - Valid Question
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is artificial intelligence?"}'
```
Expected: JSON with question, answer, timestamp, id

### Chat Endpoint - Empty Question
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": ""}'
```
Expected: `{"error":"Question cannot be empty"}`

### Chat Endpoint - Missing Question
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{}'
```
Expected: `{"error":"Question is required"}`

### Chat Endpoint - Too Long Question
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "'$(python3 -c 'print("a"*1001)')'"}'
```
Expected: `{"error":"Question too long (max 1000 characters)"}`

---

## Frontend Tests

### Manual Testing Checklist

- [ ] Frontend loads at http://localhost:5174
- [ ] No console errors
- [ ] Theme toggle button visible (top right)
- [ ] Can click theme toggle (switches light/dark)
- [ ] Input textarea is visible
- [ ] Can type in textarea
- [ ] "Ask" button is visible
- [ ] Submit empty question shows error
- [ ] Submit valid question shows "Thinking..." state
- [ ] Answer displays after response
- [ ] Textarea clears after successful submission
- [ ] Error messages display correctly
- [ ] Can submit multiple questions

### Test Questions

1. **Simple question:** "What is AI?"
2. **Complex question:** "Explain quantum computing in simple terms"
3. **Empty question:** "" (should show error)
4. **Long question:** (paste 1000+ characters)

---

## MongoDB Verification

### Check Data in MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Click "Database" → "Browse Collections"
3. Find "cognitia" database
4. Check "conversations" collection
5. Verify documents have:
   - question
   - answer
   - timestamp
   - responseTime

---

## Integration Tests

### Full Flow Test

1. Open http://localhost:5174
2. Type: "What is machine learning?"
3. Click "Ask"
4. Wait for response
5. Verify answer displays
6. Check MongoDB has new entry
7. Submit another question
8. Verify it works again

### Error Handling Test

1. Stop backend server
2. Try to submit question
3. Should show error message
4. Restart backend
5. Try again - should work

### Theme Test

1. Click theme toggle
2. Verify colors change
3. Submit question in dark mode
4. Verify everything still works
5. Toggle back to light mode

---

## Performance Tests

### Response Time
- Questions should respond in 1-5 seconds
- Loading state should display immediately
- No UI freezing

### Rate Limiting Test
```bash
# Send 101 requests rapidly
for i in {1..101}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"question": "Test"}' &
done
wait
```
Expected: Some requests should return 429 error

---

## Browser Compatibility

Test in:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge (if available)

---

## Security Tests

- [ ] CORS blocks requests from unauthorized origins
- [ ] Rate limiting prevents abuse
- [ ] Input validation rejects invalid data
- [ ] Error messages don't expose sensitive info
- [ ] .env files not committed to git

---

## Final Checklist

- [ ] Backend runs without errors
- [ ] Frontend runs without errors
- [ ] Can submit questions and get answers
- [ ] Data saves to MongoDB
- [ ] Error handling works
- [ ] Theme toggle works
- [ ] Rate limiting works
- [ ] No console errors
- [ ] No security vulnerabilities
- [ ] Ready for deployment

---

## Known Issues

Document any issues found:

1. 
2. 
3. 

---

## Test Results

Date: ___________
Tester: ___________

Backend: ✅ / ❌
Frontend: ✅ / ❌
Integration: ✅ / ❌
MongoDB: ✅ / ❌

Notes:
