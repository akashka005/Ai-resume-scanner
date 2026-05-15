# 📖 Developer Documentation

This document provides a deep dive into the architecture, backend design, and frontend components of the **AI Resume Scanner**.

---

## 🏗️ Architecture Overview

The system follows a standard client-server architecture:
1. **Client (React + Vite):** Handles user interactions, file uploads, and renders AI feedback using interactive components and charts.
2. **Server (FastAPI):** Exposes RESTful endpoints, processes uploaded PDFs, and communicates with the LLM via the Groq API.
3. **LLM (Groq):** Powered by the Llama-3 model (`llama-3.1-8b-instant`), responsible for evaluating the resume against a target role and generating JSON-formatted structured responses.

---

## 🔌 API Reference (Backend)

The backend exposes two primary endpoints located under `/api`.

### 1. `POST /api/scan`
Analyzes a PDF resume against a specified target role.

- **Accepts (FormData):**
  - `file`: The resume file (must be `.pdf`).
  - `model_choice`: The Groq model to use (default: `llama-3.1-8b-instant`).
  - `target_role`: The desired job title (e.g., `DevOps Engineer`).
- **Response (`ScanResponse` JSON):**
  - `overall_score`: Integer (0-100).
  - `role_match`: Integer (0-100).
  - `missing_keywords`: Array of missing skills.
  - `top_skills`: Array of identified skills.
  - `suggestions`: Array of actionable feedback strings.
  - `score_breakdown`: Object with scores for `formatting`, `keywords`, and `impact`.
  - `interview_questions`: Array of objects containing `question`, `category`, and `difficulty`.

### 2. `POST /api/interview/evaluate`
Evaluates a user's answer to a generated interview question.

- **Accepts (FormData):**
  - `question`: The interview question asked.
  - `answer`: The user's provided answer.
  - `target_role`: The role being interviewed for.
  - `category`: The category of the question (e.g., `Technical`, `Behavioral`).
- **Response (`AnswerEvaluation` JSON):**
  - `score`: Integer (0-10) rating the answer.
  - `feedback`: Detailed string explaining what was good and what to improve.
  - `ideal_points`: Array of points that should have been covered.

---

## 📂 Backend Structure

Located in `/backend/app/`:

- `main.py`: Application entry point and CORS configuration.
- `api/routes.py`: Defines the FastAPI endpoints mapping to controller logic.
- `models/schemas.py`: Pydantic models enforcing strict type safety for API requests and LLM JSON outputs.
- `services/pdf_parser.py`: Utility utilizing `PyMuPDF` to extract clean text from uploaded PDFs.
- `services/groq_client.py`: The core logic managing the Groq SDK, sending prompts, and parsing responses.
- `services/prompts.py`: Centralized location for LLM system prompts, ensuring consistent persona and JSON output structures.

---

## ⚛️ Frontend Component Ecosystem

Located in `/frontend/src/components/`:

- `UploadSection.jsx`: Handles drag-and-drop file inputs and role selection.
- `ScoreGauge.jsx` & `ScoreBreakdown.jsx`: Uses `recharts` and custom SVG components to visualize the ATS score.
- `SkillsRadar.jsx`: Plots the user's proficiency across various domains based on the AI analysis.
- `MissingKeywords.jsx` & `TopSkills.jsx`: Renders skill tags for immediate visual feedback.
- `InterviewQuestions.jsx`: The interactive UI for the mock interview phase, managing state for user answers and displaying real-time AI evaluation feedback.

---

## 🧠 LLM Integration Notes

The project relies heavily on strict JSON schemas. The Groq API is prompted to return outputs in a predefined JSON format matching our Pydantic `ScanResponse` model. If you wish to extend the AI capabilities (e.g., adding a Cover Letter generator), ensure you update `prompts.py` and create a corresponding Pydantic schema in `schemas.py` to maintain stability.
