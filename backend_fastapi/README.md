# VeriFin Backend

FastAPI-based financial intelligence API.

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your API keys

# Run server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

- `GET /health` - Health check
- `POST /resolve-company` - Resolve company name to ticker
- `POST /company-overview` - Get company financial overview
- `POST /company-compare` - Compare two companies
- `POST /chat` - AI chat assistant
- `POST /document-analyze` - Analyze financial documents

## Deployment

Deploy to Render.com using:
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
