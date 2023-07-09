# How to run
## Docker
Go into `back-end` directory and run:
```
docker-compose up
```
## Locally
Go into `back-end` directory and run:
```
uvicorn main:app --reload --workers 1 --host 0.0.0.0 --port 8000
```