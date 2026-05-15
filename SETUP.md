# 🚀 Installation & Setup Guide

Welcome to the **AI Resume Scanner**! This guide will walk you through setting up the project on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js** (v18+ recommended) & **npm**
- **Python** (v3.9+ recommended)
- **Git**
- A **Groq API Key** (Get one for free at [console.groq.com](https://console.groq.com/))

---

## 🛠️ Step 1: Clone the Repository

First, clone the project to your local machine:

```bash
git clone https://github.com/akashka005/Ai-resume-scanner.git
cd Ai-resume-scanner
```

---

## 🐍 Step 2: Backend Setup (FastAPI)

The backend is built with Python and FastAPI. We recommend using a virtual environment.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   - On **Windows**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - On **macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up Environment Variables:**
   - Create a file named `.env` in the `backend` directory.
   - Add your Groq API key to the file:
     ```env
     GROQ_API_KEY=your_groq_api_key_here
     ```

5. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   > The backend will start running at `http://localhost:8000`. You can view the interactive API docs at `http://localhost:8000/docs`.

---

## 💻 Step 3: Frontend Setup (React + Vite)

The frontend is a React application built with Vite.

1. **Open a new terminal window** and navigate to the frontend directory from the project root:
   ```bash
   cd frontend
   ```

2. **Install Node modules:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   > The frontend will typically run at `http://localhost:5173`. Open this URL in your browser to see the app!

---

## 🎉 You're All Set!
You can now upload a PDF resume, select your target role, and get AI-powered insights! If you encounter any issues, make sure your `.env` file is properly configured and both servers are running simultaneously.
