from fastapi import FastAPI, HTTPException
from typing import List
from .models import Transaction, AnalysisRequest, AnalysisResponse
from .analytics import FinancialAnalytics

app = FastAPI(
    title="Financial Analytics API",
    description="API for analyzing financial metrics and generating insights",
    version="1.0.0"
)

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_financials(request: AnalysisRequest):
    try:
        # Initialize analytics engine
        analytics = FinancialAnalytics(
            transactions=request.transactions,
            btc_price=request.btc_price
        )
        
        # Calculate metrics
        metrics = analytics.calculate_metrics()
        
        # Generate response
        return AnalysisResponse(
            metrics=metrics,
            recommendations=metrics.insights
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 