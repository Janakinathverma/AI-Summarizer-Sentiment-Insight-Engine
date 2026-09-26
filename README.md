# AI Summarizer & Sentiment Insight Engine

**Tech Stack:** React.js (Vite) · FastAPI (Python) · Hugging Face Inference API · Docker & Docker Compose · Tailwind CSS

---

## 1. Executive Overview

An end-to-end, asynchronous full-stack AI web application designed to process unstructured text, articles, or uploaded documents. The application leverages FastAPI as a high-performance backend microservice, consuming Hugging Face Inference Models (BART & DistilBERT) to deliver real-time text summarization and sentiment insights through a futuristic glassmorphism React-based user interface.

## 2. Architecture & Workflow

```
[ React Frontend (Vite) ]  ---> (HTTP POST / Async JSON)
                           ---> [ FastAPI Backend ]
                           ---> (Hugging Face Inference API)
                           <--- (Model Predictions & Metadata)
[ React Frontend ]         <--- (Structured JSON Response + Viz Data)
```

## 3. Key Features

- **Asynchronous Data Pipeline** — Built with FastAPI's `async`/`await` capabilities using HTTPX to prevent thread-blocking during third-party AI model inferences.
- **Pre-Trained AI Integration** — Integrates Hugging Face transformer models: `facebook/bart-large-cnn` for multi-sentence summarization and `distilbert-base-uncased-finetuned-sst-2-english` for sentiment classification.
- **Futuristic UI & Theme Switcher** — Responsive glassmorphism interface with Orbitron & Rajdhani fonts, featuring dynamic Light/Dark mode toggling.
- **Robust Payload Validation** — Enforces strict request/response data schemas using Pydantic models to guarantee API reliability and clean error handling.
- **Production Containerization** — Complete setup packaged into a unified portable Docker image and managed via Docker Compose for single-port deployment.

## 4. Quick Start & Deployment

### Local Development Setup

1. **Frontend Build:**
   ```bash
   cd frontend
   npm install
   npm run build
   cp -r dist ../backend/app/static
   ```

2. **Backend Execution:**
   ```bash
   cd ../backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

### Docker Compose Deployment

Root directory par Docker Compose run karke full-stack application spin-up karein:

```bash
# Build and start container in detached mode
docker compose up -d --build

# View application logs
docker compose logs -f

# Stop container
docker compose down
```

Access the application in browser:

- **Web App Dashboard:** `http://localhost:8000`
- **Interactive OpenAPI Documentation:** `http://localhost:8000/docs`

## 5. API Specification (FastAPI)

### `POST /api/v1/summarize`
Accepts raw text payload and returns concise structured summary with processing time.

**Request Body**
```json
{
  "text": "string",
  "max_length": 130,
  "min_length": 30
}
```

**Response**
```json
{
  "summary_text": "string",
  "processing_time_ms": 240.5
}
```

### `POST /api/v1/sentiment`
Analyzes emotional tone and confidence score of submitted text.

**Request Body**
```json
{
  "text": "string"
}
```

**Response**
```json
{
  "label": "POSITIVE | NEGATIVE",
  "score": 0.985
}
```

### `GET /health`
Health check endpoint monitoring upstream AI API availability.

## 6. CV / Resume Impact Summary

- Engineered a full-stack AI analytics platform integrating React (Vite) with a high-throughput FastAPI asynchronous backend.
- Integrated Hugging Face Inference APIs (BART, DistilBERT) for real-time document summarization and sentiment classification with zero local GPU overhead.
- Implemented Pydantic schema validation, CORS middleware, and custom HTTP exception handling to ensure production-grade REST API security and stability.
- Containerized frontend and backend services using Docker & Docker Compose for reproducible, environment-agnostic deployment.
