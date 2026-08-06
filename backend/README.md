# Procura Backend API - Foundation Setup

This is the FastAPI backend foundation directory of Procura.

## Folder Structure

```text
backend/
├── app/
│   ├── api/          # Route controllers by versions
│   ├── core/         # Settings configs, loggers and security layers
│   ├── db/           # SQL declarations models and database clients
│   ├── dependencies/ # Token validators and RBAC checker hooks
│   └── main.py       # API mounts entrypoint
├── alembic/          # Database revisions files
├── alembic.ini       # Alembic migrations configuration settings
├── Dockerfile        # Container specifications setup
└── docker-compose.yml# Multi-service docker configuration
```

## Running Locally

### Docker Compose
One command starts both the backend API server and a PostgreSQL database container:
```bash
docker compose up --build
```
The API Swagger documentation will be available at [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs).
