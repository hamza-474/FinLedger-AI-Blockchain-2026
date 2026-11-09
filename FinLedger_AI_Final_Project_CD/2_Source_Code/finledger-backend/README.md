# FinLedger AI Backend

Blockchain-Enabled Organizational Finance Monitor.

## Features
- JWT Authentication & Role based Access
- Custom JS Blockchain for Immutable Transactions
- Dynamic Budget Management
- Reports and Analytics
- AI Analysis via Google Gemini API

## Setup
1. `npm install`
2. Create `.env` file from `.env.example`
3. Make sure MongoDB is running locally or specify `MONGODB_URI`
4. `npm run dev`

## Environment Variables
- `PORT`: API Port (default 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `JWT_EXPIRE`: JWT Expiration (e.g. 30d)
- `GEMINI_KEY_1`, `GEMINI_KEY_2`, `GEMINI_KEY_3`: Fallback pool of Gemini AI API Keys

## API Endpoints
- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Transactions**: `/api/transactions`, `/api/transactions/:id`, `/api/transactions/summary`
- **Blockchain**: `/api/blockchain/chain`, `/api/blockchain/verify`
- **Budgets**: `/api/budgets`, `/api/budgets/status`, `/api/budgets/:id`
- **AI**: `/api/ai/predict-spending`, `/api/ai/detect-anomalies`, `/api/ai/generate-report`, `/api/ai/ask`
- **Reports**: `/api/reports/dashboard`, `/api/reports/monthly`, `/api/reports/yearly`, `/api/reports/category`, `/api/reports/export`

View complete Swagger API Docs by navigating to `http://localhost:<PORT>/api-docs` after running the server.
