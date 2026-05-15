from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI(title="DevOps Resume Scanner API")

Instrumentator().instrument(app).expose(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the DevOps Resume Scanner API. Visit /docs for the Swagger UI."}