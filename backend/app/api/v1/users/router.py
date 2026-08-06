from fastapi import APIRouter

router = APIRouter()

@router.get("", summary="List users placeholder")
def list_users_placeholder():
    return {
        "success": True,
        "message": "Users directory endpoint active - backend phase 1 scaffolding",
        "data": []
    }
