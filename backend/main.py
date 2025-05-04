from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import config

app = FastAPI(
    title=config.PROJECT_NAME,
    openapi_url=f"{config.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to OrangeCat API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Import and include routers
from services import user_pages, transparency_score, transparency_report

app.include_router(
    user_pages.router,
    prefix=f"{config.API_V1_STR}/user-pages",
    tags=["user-pages"]
)

app.include_router(
    transparency_score.router,
    prefix=f"{config.API_V1_STR}/transparency",
    tags=["transparency"]
)

app.include_router(
    transparency_report.router,
    prefix=f"{config.API_V1_STR}/reports",
    tags=["reports"]
) 