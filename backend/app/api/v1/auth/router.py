from fastapi import APIRouter

router = APIRouter()

@router.post("/login", summary="User authentication placeholder")
def login_placeholder():
    return {
        "success": True,
        "message": "Auth endpoint active - backend phase 1 scaffolding",
        "data": {}
    }
