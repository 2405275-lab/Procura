import os
import shutil

ROOT_DIR = r"C:\CODING\PROJECTS\Procura"
AGENTS_DIR = os.path.join(ROOT_DIR, "agents")
NEW_TESTS_DIR = os.path.join(ROOT_DIR, "backend", "app", "tests", "agents")

def move_tests():
    os.makedirs(NEW_TESTS_DIR, exist_ok=True)
    
    agent_modules = [
        "ocr", "extraction", "vendor_intelligence", "comparison", "policy", 
        "purchase_order", "audit", "orchestrator"
    ]
    
    for module in agent_modules:
        old_test_path = os.path.join(AGENTS_DIR, module, "tests.py")
        new_test_path = os.path.join(NEW_TESTS_DIR, f"test_{module}.py")
        
        if os.path.exists(old_test_path):
            if os.path.exists(new_test_path):
                os.remove(new_test_path)
            shutil.move(old_test_path, new_test_path)
            print(f"Moved and renamed: agents/{module}/tests.py -> backend/app/tests/agents/test_{module}.py")
        else:
            print(f"Source file not found: {old_test_path}")

if __name__ == "__main__":
    move_tests()
