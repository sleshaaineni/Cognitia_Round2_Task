# Conversational AI Assistant

A full-stack web application that enables users to interact with an AI-powered assistant through a clean, intuitive interface. Each query receives a single, focused response powered by Groq's Llama 3.1 model.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB Atlas account
- Groq API key

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Cognitia_Round2_Task

# Backend setup
cd backend
npm install
cp .env.example .env
# Add your GROQ_API_KEY and MONGODB_URI to .env
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to use the application.

## 📋 Features

- Single question-answer interaction model
- AI-powered responses using Groq's Llama 3.1 8B Instant model
- Persistent storage of Q&A pairs in MongoDB Atlas
- Clean, modern UI with light/dark mode toggle
- Comprehensive error handling
- Security-first architecture

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Modern CSS with theme support
- Axios for API communication

**Backend:**
- Node.js with Express
- Groq API (llama-3.1-8b-instant)
- MongoDB Atlas for data persistence
- Security middleware (helmet, cors, rate limiting)

## 📁 Project Structure

```
Cognitia_Round2_Task/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express API server
│   ├── src/
│   ├── models/
│   └── package.json
└── docs/              # Documentation
```

## 🌐 Deployment

**Frontend:** Deployed on Vercel  
**Backend:** Deployed on Vercel  
**Database:** MongoDB Atlas

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design and data flow
- [TECH_STACK.md](./TECH_STACK.md) - Technology choices and justifications
- [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md) - Key architectural decisions
- [SECURITY.md](./SECURITY.md) - Security measures implemented
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoints and usage
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Local development setup
- [vibecoded.md](./vibecoded.md) - AI tools used in development

## 🔑 Environment Variables

See `.env.example` files in both frontend and backend directories.

## 📝 API Usage

```javascript
// POST /api/chat
const response = await fetch('https://your-backend.vercel.app/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: 'What is AI?' })
});

const data = await response.json();
// { question, answer, timestamp, id }
```

## 🤝 Contributing

This is a project submission for Cognitia Round 2. For questions or issues, please contact the repository owner.

## 📄 License

This project is created for educational purposes as part of Cognitia Round 2 evaluation.

## 🎯 Evaluation Focus

This project emphasizes:
- Clean code architecture
- Proper API integration
- Successful deployment
- Security best practices
- Comprehensive documentation
- Quality Git commit history
