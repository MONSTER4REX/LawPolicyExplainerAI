# Law Policy Explainer AI

An AI-powered web application that helps users understand legal and policy documents by providing plain-language summaries and risk analysis.

## 🚀 Features

- **Document Upload**: Support for PDF, DOCX, and TXT files
- **AI-Powered Analysis**: Automatic summarization and risk identification
- **User Management**: Secure login/signup with password validation
- **Document Organization**: Create groups to categorize your documents
- **Interactive Dashboard**: View statistics and manage your documents
- **AI Assistant**: Get help and support through an integrated AI chat
- **Theme Support**: Light and dark mode
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** - User interface
- **React Router** - Navigation
- **Axios** - API communication
- **Lucide React** - Icons
- **CSS3** - Styling

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **GROQ API** - AI services
- **Supabase** - Database and authentication
- **PyPDF2** - PDF text extraction
- **python-docx** - Word document processing

## 📁 Project Structure

```
LawPolicyExplainerAI/
├── backend/                 # FastAPI backend
│   ├── app.py              # Main application
│   ├── services/           # AI and document processing
│   ├── utils/              # Database and utilities
│   └── routes/             # API endpoints
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS files
│   └── public/             # Static assets
├── docs/                   # Documentation
├── deployment/             # Deployment configs
└── tests/                  # Test files
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- GROQ API key
- Supabase account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MONSTER4REX/LawPolicyExplainerAI.git
   cd LawPolicyExplainerAI
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv venv
   venv\Scripts\activate  # Windows
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Create .env file
   cp env.example .env
   # Edit .env with your API keys
   
   # Start backend
   python -m uvicorn backend.app:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key
REACT_APP_API_URL=http://localhost:8000
```

## 📱 Usage

1. **Sign Up/Login**: Create an account or login
2. **Upload Documents**: Upload PDF, DOCX, or TXT files
3. **View Analysis**: Get AI-powered summaries and risk analysis
4. **Organize**: Create groups to categorize your documents
5. **Get Help**: Use the AI assistant for support

## 🌐 Deployment

The application is configured for deployment on:
- **Railway** (Backend)
- **Vercel** (Frontend)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- GROQ for AI services
- Supabase for database services
- React and FastAPI communities

---

**Made with ❤️ for legal document analysis**

