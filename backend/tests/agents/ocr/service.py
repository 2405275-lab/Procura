import time
from backend.tests.agents.ocr.schemas import OCRResponseData

class OCRAgentService:
    def run(self, filename: str, file_bytes: bytes, retries: int = 1) -> dict:
        start_time = time.time()
        try:
            # Simulate optical character recognition
            # In a real setup, we would call PaddleOCR/EasyOCR or PyMuPDF
            size_kb = len(file_bytes) / 1024
            
            # Simple text parsing fallback simulation
            raw_text = f"[Quotation Document Invoice]\nFile: {filename}\nSize: {size_kb:.1f} KB\nGSTIN: 29ABCDE1234F1Z5\nVendor Name: CompSource Inc.\nQuote No: CS-2026-904\nDate: 2026-08-01\nTotal Price: $62,500.00\nWarranty: 3 Years\nDelivery SLA: 4 Days\nPayment Terms: Net 30"
            
            # Simulated failure scenario for retries checks
            if "fail" in filename.lower():
                raise ValueError("OCR scanning process timed out due to blurry pixel streams")

            execution_time = (time.time() - start_time) * 1000
            return {
                "success": True,
                "agent": "OCRAgent",
                "execution_time_ms": execution_time,
                "confidence": 98.0,
                "data": {
                    "raw_text": raw_text,
                    "confidence": 98.0,
                    "page_count": 1
                }
            }
        except Exception as e:
            if retries > 0:
                # Retry once
                return self.run(filename, file_bytes, retries - 1)
                
            execution_time = (time.time() - start_time) * 1000
            return {
                "success": False,
                "agent": "OCRAgent",
                "execution_time_ms": execution_time,
                "confidence": 0.0,
                "error": str(e),
                "data": {
                    "raw_text": "",
                    "confidence": 0.0,
                    "page_count": 0
                }
            }

ocr_agent_service = OCRAgentService()
