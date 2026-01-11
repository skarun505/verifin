# VeriFin – Financial Intelligence Platform

## 🚀 Free Hosting Architecture
- **Backend:** FastAPI (Python) → Render Free Tier
- **Frontend:** Next.js → Netlify Free Tier
- **Demo Ready:** For Students, Investors, and Presentations

---

## 📁 Project Structure
```
verifin/
├── backend_fastapi/          # FastAPI Backend (Deploy to Render)
│   ├── main.py              # Main application entry
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example        # Environment variables template
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic
│   └── models/             # Data models
│
├── frontend_next/           # Next.js Frontend (Deploy to Netlify)
│   ├── package.json        # Node.js dependencies
│   ├── next.config.js      # Next.js configuration
│   ├── .env.local.example  # Frontend environment template
│   ├── app/                # Next.js 13+ app directory
│   ├── components/         # React components
│   └── lib/                # Utility functions
│
└── README.md
```

---

## 🔧 Quick Start

### Backend (Local Development)
```bash
cd backend_fastapi
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (Local Development)
```bash
cd frontend_next
npm install
cp .env.local.example .env.local
# Edit .env.local with backend URL
npm run dev
```

---

## 🌐 Deployment

### Deploy Backend to Render
1. Push to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Set Root Directory: `backend_fastapi`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
7. Add environment variables (API keys)

### Deploy Frontend to Netlify
1. Push to GitHub
2. Create new site on Netlify
3. Set Base Directory: `frontend_next`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `.next`
6. Add Environment Variable: `NEXT_PUBLIC_BACKEND_URL`

---

## 🎯 Features
- 🔍 **Company Search** with fuzzy matching
- 📊 **Financial Overview** with live data
- 🆚 **Company Comparison** tools
- 💬 **AI Chat Assistant** for financial queries
- 📄 **Document Analyzer** for financial reports (PDF)
- 🔐 **Secure** backend with API authentication

---

## 🧪 Testing Endpoints

After deployment, test:
```bash
# Health check
curl https://your-backend.onrender.com/health

# Company search
curl -X POST https://your-backend.onrender.com/resolve-company \
  -H "Content-Type: application/json" \
  -d '{"query":"Apple"}'
```

---

## 📝 License
Built for educational and demonstration purposes.
