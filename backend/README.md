# Backend Services

This directory contains all backend services and Python code for the OrangeCat platform.

## Structure

```
/backend
├── services/         # Backend service implementations
├── templates/        # Template files
└── config.py        # Configuration settings
```

## Services

- `user_pages.py`: User page management
- `transparency_score.py`: Transparency scoring system
- `transparency_report.py`: Transparency report generation
- `template_generator.py`: Template generation utilities
- `recorder.py`: Screen recording functionality
- `platform_manager.py`: Platform management utilities
- `bitcoin_tracker.py`: Bitcoin tracking functionality

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Run services:
```bash
python -m backend.services
``` 