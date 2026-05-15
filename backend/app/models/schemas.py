from pydantic import BaseModel
from typing import List, Dict, Optional

class ReadabilityMetrics(BaseModel):
    score: int
    reading_time: str

class ScoreBreakdown(BaseModel):
    impact: int
    brevity: int
    style: int
    structure: int

class RecruiterView(BaseModel):
    six_second_impression: str
    red_flags: List[str]
    green_flags: List[str]

class RoleMatch(BaseModel):
    role: str
    match_percentage: int
    why_this_match: str
    skills_helping: List[str]
    skills_reducing: List[str]

class UpskillResource(BaseModel):
    title: str
    url: str
    type: str

class UpskillDay(BaseModel):
    day: str
    focus: str
    action_items: List[str]
    resources: Optional[List[UpskillResource]] = []

class ScanResponse(BaseModel):
    summary: str
    ats_score: int
    match_score: int
    skills_found_count: int
    resume_health_score: int
    experience_level: str
    hiring_probability: int
    top_strengths: List[str]
    weakness_summary: str
    ai_insights_snapshot: str

    readability: ReadabilityMetrics
    score_breakdown: ScoreBreakdown
    skills_radar: Dict[str, int]
    top_skills: List[str]
    missing_keywords: List[str]
    ai_suggestions: List[str]
    
    top_matched_roles: Optional[List[str]] = None
    role_matches: List[RoleMatch]
    recruiter_view: RecruiterView
    upskilling_plan: List[UpskillDay]
    
    detailed_skills: Dict[str, List[str]]
    recommended_interview_questions: List[str]

class AnswerEvaluation(BaseModel):
    technical_score: int
    communication_score: int
    confidence_score: int
    feedback: str
    follow_up_question: str