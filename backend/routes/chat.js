const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Conversation = require('../models/Conversation');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post('/', async (req, res) => {
  try {
    const { question } = req.body;

    // Validate input
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const sanitizedQuestion = question.trim();
    if (sanitizedQuestion.length === 0) {
      return res.status(400).json({ error: 'Question cannot be empty' });
    }

    if (sanitizedQuestion.length > 1000) {
      return res.status(400).json({ error: 'Question too long (max 1000 characters)' });
    }

    // Call Groq API
    const startTime = Date.now();
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: sanitizedQuestion }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1
    });

    const answer = chatCompletion.choices[0]?.message?.content || 'No response generated';
    const responseTime = Date.now() - startTime;

    // Save to MongoDB
    const conversation = new Conversation({
      question: sanitizedQuestion,
      answer,
      responseTime
    });

    await conversation.save();

    // Return response
    res.json({
      question: sanitizedQuestion,
      answer,
      timestamp: conversation.timestamp,
      id: conversation._id
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    if (error.status === 429) {
      return res.status(429).json({ error: 'AI service rate limit reached. Please try again later.' });
    }

    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

module.exports = router;
