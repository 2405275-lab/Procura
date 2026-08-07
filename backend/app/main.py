import time
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from loguru import logger

from backend.app.core.config import settings
from backend.app.core.logging import setup_logging
from backend.app.api.v1.health.router import router as health_router
from backend.app.api.v1.system.router import router as system_router
from backend.app.api.v1.auth.router import router as auth_router
from backend.app.api.v1.users.router import router as users_router
from backend.app.api.v1.purchase_requests import router as purchase_requests_router
from backend.app.api.v1.vendors import router as vendors_router
from backend.app.api.v1.quotations import router as quotations_router
from backend.app.api.v1.policies import router as policies_router
from backend.app.api.v1.approvals import router as approvals_router
from backend.app.api.v1.agents import router as agents_router
from backend.app.api.v1.notifications import router as notifications_router
from backend.app.api.v1.dashboard import router as dashboard_router
from backend.app.api.v1.monitoring import router as monitoring_router

# Eagerly import all models to register on Base for SQLAlchemy relations
import backend.app.models

# Setup Loguru logger configs
setup_logging()

app = FastAPI(
    title="Procura Backend API",
    description="Enterprise Procurement Decision Intelligence Platform",
    version="1.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gzip compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Request logging & Response Timing Middleware
@app.middleware("http")
async def log_requests_middleware(request: Request, call_next):
    start_time = time.time()
    path = request.url.path
    method = request.method
    logger.info(f"Incoming Request: {method} {path}")
    
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info(f"Response: {method} {path} - Status: {response.status_code} - Completed in {process_time:.2f}ms")
        response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
        return response
    except Exception as e:
        process_time = (time.time() - start_time) * 1000
        logger.error(f"Request failed: {method} {path} - Exception: {str(e)} - Duration {process_time:.2f}ms")
        raise e

# Global Exception Handlers

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation failure: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({
            "success": False,
            "message": "Validation failed",
            "error_code": "VALIDATION_ERROR",
            "errors": exc.errors()
        })
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning(f"HTTP exception: status={exc.status_code} detail={exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "error_code": f"HTTP_{exc.status_code}"
        }
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled system error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An unexpected server error occurred.",
            "error_code": "INTERNAL_SERVER_ERROR"
        }
    )

# Routing Mounts
app.include_router(health_router, prefix="/api/v1/health", tags=["Health"])
app.include_router(system_router, prefix="/api/v1/system", tags=["System"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(purchase_requests_router, prefix="/api/v1/purchase-requests", tags=["Purchase Requests"])
app.include_router(vendors_router, prefix="/api/v1/vendors", tags=["Vendors"])
app.include_router(quotations_router, prefix="/api/v1/quotations", tags=["Quotations"])
app.include_router(policies_router, prefix="/api/v1/policies", tags=["Policies"])
app.include_router(approvals_router, prefix="/api/v1/approvals", tags=["Approvals"])
app.include_router(agents_router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(monitoring_router, prefix="/api/v1/monitoring", tags=["Monitoring"])

@app.on_event("startup")
def startup_event():
    logger.info("Procura Backend service is successfully initialized and listening on interface nodes.")

@app.on_event("shutdown")
def shutdown_event():
    logger.info("Procura Backend service is shutting down - closing database engines connections pool.")
