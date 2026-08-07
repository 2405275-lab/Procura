import time
from typing import List

class ComparisonAgentService:
    def run(self, quotations: List[dict]) -> dict:
        start_time = time.time()
        
        # Rank by price (cheaper is better)
        sorted_quotes = sorted(quotations, key=lambda x: x.get("price", 0))
        
        ranked_vendors = []
        for idx, q in enumerate(sorted_quotes):
            price = q.get("price", 0)
            vendor_name = q.get("vendor_name", "Unknown Vendor")
            score = max(10, min(100, int((150000 - price) / 1000)))
            
            ranked_vendors.append({
                "vendor_name": vendor_name,
                "overall_score": float(score),
                "rank": idx + 1,
                "reasoning": f"Ranked #{idx + 1} with a quotation bid price of ${price:,.2f}."
            })
            
        explanation = f"Recommended best vendor is {ranked_vendors[0]['vendor_name'] if ranked_vendors else 'None'} due to lowest cost parameter bid."
        
        execution_time = (time.time() - start_time) * 1000
        return {
            "success": True,
            "agent": "ComparisonAgent",
            "execution_time_ms": execution_time,
            "confidence": 92.0,
            "data": {
                "ranked_vendors": ranked_vendors,
                "explanation": explanation
            }
        }

comparison_agent_service = ComparisonAgentService()
