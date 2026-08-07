import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.tests.agents.orchestrator.service import orchestrator_service, JOBS_REGISTRY
from backend.app.schemas.common import StandardResponse

router = APIRouter()

@router.post("/process-quotation", response_model=StandardResponse[dict], summary="Process quotation through multi-agent AI pipeline")
async def process_quotation(
    background_tasks: BackgroundTasks,
    purchase_request_id: str = Form(...),
    vendor_id: str = Form(...),
    budget: float = Form(100000.0),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        contents = await file.read()
        job_id = f"job-{uuid.uuid4()}"
        
        # Enqueue orchestrator execution as async background task
        background_tasks.add_task(
            orchestrator_service.execute_pipeline,
            db,
            job_id=job_id,
            filename=file.filename,
            file_bytes=contents,
            pr_id=purchase_request_id,
            vendor_id=vendor_id,
            budget=budget
        )
        
        return {
            "success": True,
            "message": "Quotation processing job initiated successfully in background",
            "data": {
                "job_id": job_id,
                "status": "PROCESSING"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline task dispatch failed: {str(e)}")

@router.get("/status/{job_id}", response_model=StandardResponse[dict], summary="Get job processing status")
def get_job_status(job_id: str):
    if job_id not in JOBS_REGISTRY:
        raise HTTPException(status_code=404, detail="Job execution not found")
        
    job = JOBS_REGISTRY[job_id]
    return {
        "success": True,
        "message": "Job status retrieved",
        "data": {
            "job_id": job_id,
            "status": job["status"],
            "current_agent": job["current_agent"],
            "progress": job["progress"]
        }
    }

@router.get("/results/{job_id}", response_model=StandardResponse[dict], summary="Get job final parsed results")
def get_job_results(job_id: str):
    if job_id not in JOBS_REGISTRY:
        raise HTTPException(status_code=404, detail="Job execution not found")
        
    job = JOBS_REGISTRY[job_id]
    if job["status"] != "SUCCESS":
        raise HTTPException(status_code=400, detail=f"Job results not ready. Current state: {job['status']}")
        
    return {
        "success": True,
        "message": "Job results retrieved successfully",
        "data": job["results"]
    }

@router.post("/retry/{job_id}", response_model=StandardResponse[dict], summary="Retry failed processing job")
def retry_job(
    job_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    if job_id not in JOBS_REGISTRY:
        raise HTTPException(status_code=404, detail="Job not found")
        
    # Re-run task in background
    background_tasks.add_task(
        orchestrator_service.execute_pipeline,
        db,
        job_id=job_id,
        filename="retry_doc.pdf",
        file_bytes=b"Retry parsing quotation sheets",
        pr_id="PR-2041",
        vendor_id="VND-001",
        budget=100000.0
    )
    
    return {
        "success": True,
        "message": "Retry job dispatched in background",
        "data": {
            "job_id": job_id,
            "status": "PROCESSING"
        }
    }

@router.get("/history", response_model=StandardResponse[list], summary="Get historical pipeline executions list")
def get_jobs_history():
    history_list = []
    for jid, job in JOBS_REGISTRY.items():
        history_list.append({
            "job_id": jid,
            "status": job["status"],
            "progress": job["progress"]
        })
    return {
        "success": True,
        "message": "Job history registry retrieved",
        "data": history_list
    }
