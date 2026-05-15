from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.models.schemas import ScanResponse, AnswerEvaluation
from app.services.pdf_parser import extract_text_from_pdf
from app.services.groq_client import scan_resume, evaluate_interview_answer

router = APIRouter()

@router.post("/scan", response_model=ScanResponse)
async def scan_resume_endpoint(
    file: UploadFile = File(...),
    model_choice: str = Form("llama-3.1-8b-instant"),
    target_role: str = Form("DevOps Engineer")
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported currently.")
    
    try:
        file_content = await file.read()
        resume_text = extract_text_from_pdf(file_content)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")

        result = await scan_resume(resume_text, model_choice, target_role)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/interview/evaluate", response_model=AnswerEvaluation)
async def evaluate_answer_endpoint(
    question: str = Form(...),
    answer: str = Form(...),
    target_role: str = Form(...),
    category: str = Form("Technical")
):
    try:
        evaluation = await evaluate_interview_answer(question, answer, target_role, category, "llama-3.1-8b-instant")
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))