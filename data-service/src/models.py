from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Transaction(BaseModel):
    txid: str
    time: int
    value: int
    address: str
    amount: int
    timestamp: int
    memo: Optional[str] = None
    tags: Optional[List[str]] = None

class FinancialMetrics(BaseModel):
    # Balance metrics
    total_balance: Dict[str, float] = Field(..., description="Total balance in BTC and USD")
    
    # Transaction metrics
    transaction_stats: Dict[str, Any] = Field(..., description="Transaction statistics")
    
    # Time-based metrics
    recent_activity: Dict[str, Dict[str, Any]] = Field(..., description="Activity metrics for different time periods")
    
    # Distribution metrics
    donation_distribution: Dict[str, Any] = Field(..., description="Donation distribution statistics")
    
    # Growth metrics
    growth: Dict[str, float] = Field(..., description="Growth metrics for various indicators")
    
    # Additional metrics
    predictions: Optional[Dict[str, Any]] = None
    trends: Optional[Dict[str, Any]] = None
    insights: Optional[List[str]] = None

class AnalysisRequest(BaseModel):
    transactions: List[Transaction]
    btc_price: Optional[float] = None
    time_period: Optional[str] = "30d"
    metrics: Optional[List[str]] = None

class AnalysisResponse(BaseModel):
    metrics: FinancialMetrics
    visualizations: Optional[Dict[str, str]] = None
    recommendations: Optional[List[str]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow) 