import os
import time
import random

class PurchaseOrderAgentService:
    def run(self, pr_id: str, quote: dict) -> dict:
        start_time = time.time()
        
        po_num = f"PO-2026-{random.randint(9000, 9999)}"
        price = quote.get("price", 0.0)
        vendor = quote.get("vendor_name", "Unknown Vendor")
        
        po_layout = f"""
=============================================
             PROCURA PURCHASE ORDER
=============================================
PO Number: {po_num}
Vendor: {vendor}
Requisition Ref: {pr_id}
Total Value: ${price:,.2f}
---------------------------------------------
Status: Approved & Dispatched
=============================================
"""
        # Save mock file locally if needed
        os.makedirs("uploads/purchase_orders", exist_ok=True)
        pdf_path = f"uploads/purchase_orders/{po_num}.pdf"
        with open(pdf_path, "w") as f:
            f.write(po_layout)

        execution_time = (time.time() - start_time) * 1000
        return {
            "success": True,
            "agent": "PurchaseOrderAgent",
            "execution_time_ms": execution_time,
            "confidence": 99.0,
            "data": {
                "po_number": po_num,
                "download_url": f"/uploads/purchase_orders/{po_num}.pdf",
                "po_layout_text": po_layout
            }
        }

purchase_order_agent_service = PurchaseOrderAgentService()
