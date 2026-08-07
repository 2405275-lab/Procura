import time
from backend.app.jobs.celery import celery_app
from agents.ocr.service import ocr_agent_service
from agents.extraction.service import extraction_agent_service
from agents.comparison.service import comparison_agent_service
from agents.policy.service import policy_agent_service
from agents.purchase_order.service import purchase_order_agent_service

@celery_app.task(name="procura.process_ocr")
def process_ocr_task(filename: str, file_bytes_hex: str) -> dict:
    # Convert hex back to bytes
    file_bytes = bytes.fromhex(file_bytes_hex)
    return ocr_agent_service.run(filename, file_bytes)

@celery_app.task(name="procura.process_extraction")
def process_extraction_task(raw_text: str) -> dict:
    return extraction_agent_service.run(raw_text)

@celery_app.task(name="procura.process_comparison")
def process_comparison_task(quotes: list) -> dict:
    return comparison_agent_service.run(quotes)

@celery_app.task(name="procura.process_policy")
def process_policy_task(quote: dict, rules: list) -> dict:
    return policy_agent_service.run(quote, rules)

@celery_app.task(name="procura.generate_po")
def generate_po_task(pr_id: str, quote: dict) -> dict:
    return purchase_order_agent_service.run(pr_id, quote)
