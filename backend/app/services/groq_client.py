import json
from groq import AsyncGroq
from app.core.config import settings
from app.models.schemas import ScanResponse, AnswerEvaluation
from app.services.prompts import DEVOPS_SCANNER_PROMPT, EVALUATION_PROMPT, ELITE_ANALYSIS_MODIFIER, ELITE_INTERVIEW_MODIFIER

client = AsyncGroq(api_key=settings.GROQ_API_KEY)

async def scan_resume(resume_text: str, model: str, target_role: str) -> ScanResponse:    
    system_prompt = DEVOPS_SCANNER_PROMPT.replace("{target_role}", target_role)
    if "70b" in model.lower():
        system_prompt = ELITE_ANALYSIS_MODIFIER + "\n" + system_prompt
    
    response = await client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": f"Here is the resume:\n\n{resume_text}"
            }
        ],
        model=model,
        temperature=0.2, 
        response_format={"type": "json_object"}
    )
    
    result_str = response.choices[0].message.content
    try:
        data = json.loads(result_str)
        return ScanResponse(**data)
    except json.JSONDecodeError:
        raise Exception("Failed to parse JSON response from the model.")
    except Exception as e:
        raise Exception(f"Validation error: {str(e)}")

async def evaluate_interview_answer(question: str, answer: str, target_role: str, category: str = "Technical", model_choice: str = "llama-3.1-8b-instant") -> AnswerEvaluation:
    try:
        prompt = EVALUATION_PROMPT.replace("{target_role}", target_role).replace("{question}", question).replace("{answer}", answer).replace("{category}", category)
        
        system_content = "You are a Principal Engineering Manager. Always return valid JSON matching the exact schema provided."
        if "70b" in model_choice.lower():
            system_content = ELITE_INTERVIEW_MODIFIER + "\n" + system_content

        response = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": prompt}
            ],
            model=model_choice,
            temperature=0.3,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content
        parsed_data = json.loads(result_text)
        return AnswerEvaluation(**parsed_data)
        
    except Exception as e:
        raise Exception(f"AI Evaluation failed: {str(e)}")