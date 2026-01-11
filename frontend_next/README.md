# VeriFin Frontend

Next.js 14 frontend with TypeScript and Tailwind CSS.

## Local Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with backend URL

# Run development server
npm run dev
```

Visit http://localhost:3000

## Build for Production

```bash
npm run build
npm run start
```

## Deployment

Deploy to Netlify:
- Base directory: `frontend_next`
- Build command: `npm install && npm run build`
- Publish directory: `.next`
- Environment variable: `NEXT_PUBLIC_BACKEND_URL`

## Features

- 🔍 Company Search with fuzzy matching
- 📊 Financial Overview with live data
- 🆚 Company Comparison tool
- 💬 AI Chat Assistant
- 📄 Document Analyzer
