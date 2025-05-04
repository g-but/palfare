# Financial Analytics Data Service

This service provides advanced financial analytics and insights for the Orange Cat fundraising platform. It's built with Python and uses modern data science libraries for comprehensive analysis.

## Features

- Real-time financial metrics calculation
- Time series analysis and predictions
- Growth trend analysis
- Actionable insights generation
- Scalable data processing
- REST API interface

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the API server:
```bash
uvicorn src.api:app --reload
```

## API Endpoints

### POST /analyze
Analyze financial data and generate metrics and insights.

Request body:
```json
{
  "transactions": [
    {
      "txid": "string",
      "time": 0,
      "value": 0,
      "address": "string",
      "amount": 0,
      "timestamp": 0
    }
  ],
  "btc_price": 0,
  "time_period": "30d",
  "metrics": ["string"]
}
```

### GET /health
Check service health status.

## Data Processing

The service uses several key components for data analysis:

1. **FinancialAnalytics**: Core analytics engine that:
   - Calculates comprehensive metrics
   - Generates predictions
   - Analyzes trends
   - Provides insights

2. **Data Models**: Pydantic models for:
   - Data validation
   - Type safety
   - API documentation

3. **Analysis Pipeline**:
   - Data preprocessing
   - Statistical analysis
   - Machine learning predictions
   - Insight generation

## Extending the Service

To add new metrics or analysis:

1. Add new methods to `FinancialAnalytics` class
2. Update the `FinancialMetrics` model
3. Add new API endpoints if needed

## Testing

Run tests with:
```bash
pytest tests/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request 