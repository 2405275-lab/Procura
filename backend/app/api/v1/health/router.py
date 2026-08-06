from fastapi import APIRouter

router = APIRouter()

@router.get("", summary="Get service health status")
def check_health():
    return {
        "success": True,
        "message": "Service health checked",
        "data": {
            "status": "healthy",
            "service": "Procura Backend",
            "version": "1.0"
        }
    }
