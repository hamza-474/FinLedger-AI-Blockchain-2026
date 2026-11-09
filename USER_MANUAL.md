# FinLedger AI: User Manual & Documentation
**Blockchain-Enabled Organizational Finance Monitor**

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [System Setup & Installation](#2-system-setup--installation)
3. [User Roles & Access Control](#3-user-roles--access-control)
4. [Core Features Walkthrough](#4-core-features-walkthrough)
   - [Transactions Ledger](#transactions-ledger)
   - [Budget Planning](#budget-planning)
   - [Blockchain Explorer (Auditing)](#blockchain-explorer-auditing)
   - [AI Financial Intelligence (Predictions, Anomalies & Chat)](#ai-financial-intelligence-predictions-anomalies--chat)
5. [Tampering Detection & Consensus Demonstration](#5-tampering-detection--consensus-demonstration)
6. [Troubleshooting & FAQ](#6-troubleshooting--faq)

---

## 1. Introduction
**FinLedger AI** is a next-generation financial monitoring system designed to bring security, immutability, and intelligent forecasting to organizations. By combining **cryptographic blockchain validation** with **Google Gemini AI model insights**, FinLedger AI prevents bookkeeping fraud, detects accounting anomalies, and predicts monthly cash flow patterns in real time.

---

## 2. System Setup & Installation
For full setup instructions, dependencies, and environment configurations, please refer to the main [readme.txt](file:///home/hamza/Documents/FinLedger%20AI/readme.txt).
Ensure you have **Node.js**, **MongoDB**, and a valid **Google Gemini API Key** (optional, mock fallback is provided) configured before starting the backend.

---

## 3. User Roles & Access Control
FinLedger AI supports Multi-Tenant Organization scopes, separating records by organizations.
- **Financial Manager (User)**: Can record transactions, view dashboards, configure monthly budget limits, generate AI statements, and chat with the AI Advisor.
- **System Auditor / Admin**: Has all manager privileges, plus access to the **Blockchain Explorer console** and the **Simulate Hack tool** to verify ledger integrity.

---

## 4. Core Features Walkthrough

### Transactions Ledger
1. Navigate to **Transactions** page.
2. Click **Add Transaction**. Select type (Income or Expense), amount in PKR, date, and category.
3. Once submitted:
   - The transaction is saved in MongoDB.
   - The transaction is packed into a new cryptographic Block.
   - The transaction document is sealed with the resulting `blockHash` and `blockIndex`.

### Budget Planning
1. Navigate to **Budgets** page.
2. Click **Create Budget** to allocate monthly limits to specific categories (e.g. Utilities, Equipment, Rent).
3. If an expense in a category exceeds the limit, the status indicators on the dashboard and monthly reports will automatically turn **Red** to alert management.

### Blockchain Explorer (Auditing)
1. Navigate to **Blockchain Explorer**.
2. You will see a visual representation of blocks linked together.
3. Click **Verify Now** to recalculate the SHA-256 hash chains of all blocks. If the database remains untouched, a green banner **"✅ Integrity Verified"** will be displayed.

### AI Financial Intelligence (Predictions, Anomalies & Chat)
Navigate to **AI Insights**:
1. **Predictions**: Runs predictions using transaction history to estimate the next month's spending by category, complete with confidence levels.
2. **Anomalies**: Scans logs for suspicious transactions, duplicate charges, or massive budget spikes.
3. **Financial Report**: Generates a professional PDF/markdown statement outlining the organization's monthly cash flow health.
4. **Ask AI**: A direct conversational agent that helps answer custom financial questions (e.g., *"How much did we spend on utilities last month compared to rent?"*).

---

## 5. Tampering Detection & Consensus Demonstration
To demonstrate the security of the ledger to final year project evaluators:
1. Go to the **Blockchain Explorer** page.
2. Click **Simulate Hack**. The backend will modify a transaction's amount directly in the database (bypassing normal API paths).
3. Click **Verify Now**.
4. The system will detect the hash mismatch and immediately trigger the **"🚨 TAMPERING DETECTED"** status, showing exactly which block index has been violated.

---

## 6. Troubleshooting & FAQ
* **Q: Why does the AI page show "AI Offline Mode"?**
  * **A**: Your Google Gemini API Key in the `.env` file is missing or invalid. Check that `GEMINI_KEY_1` is correctly configured.
* **Q: Can I edit the amount of an existing transaction?**
  * **A**: No. To preserve the cryptographic hash chain, amounts, types, and dates are immutable. You must delete and recreate the transaction if a mistake is made.
