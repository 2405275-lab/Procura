import os
import shutil

ROOT_DIR = r"C:\CODING\PROJECTS\Procura"
BACKEND_TESTS_AGENTS = os.path.join(ROOT_DIR, "backend", "app", "tests", "agents")
AGENTS_ROOT = os.path.join(ROOT_DIR, "agents")

def restore_structure():
    agent_modules = [
        "ocr", "extraction", "vendor_intelligence", "comparison", "policy", 
        "purchase_order", "audit", "orchestrator"
    ]
    
    for module in agent_modules:
        src_module_dir = os.path.join(BACKEND_TESTS_AGENTS, module)
        dst_module_dir = os.path.join(AGENTS_ROOT, module)
        
        if os.path.exists(src_module_dir):
            os.makedirs(dst_module_dir, exist_ok=True)
            
            # List all files in the source directory
            for item in os.listdir(src_module_dir):
                src_item_path = os.path.join(src_module_dir, item)
                
                if item == "tests.py":
                    # Move tests.py to backend/app/tests/agents/test_<module>.py
                    dst_test_path = os.path.join(BACKEND_TESTS_AGENTS, f"test_{module}.py")
                    if os.path.exists(dst_test_path):
                        os.remove(dst_test_path)
                    shutil.move(src_item_path, dst_test_path)
                    print(f"Restored test file: {src_item_path} -> {dst_test_path}")
                else:
                    # Move other files to agents/<module>/
                    dst_item_path = os.path.join(dst_module_dir, item)
                    if os.path.exists(dst_item_path):
                        if os.path.isdir(dst_item_path):
                            shutil.rmtree(dst_item_path)
                        else:
                            os.remove(dst_item_path)
                    shutil.move(src_item_path, dst_item_path)
                    print(f"Restored agent code: {src_item_path} -> {dst_item_path}")
            
            # Clean up the empty directory
            shutil.rmtree(src_module_dir)
            print(f"Cleaned up directory: {src_module_dir}")

def update_imports(directory):
    for root, dirs, files in os.walk(directory):
        if ".git" in root or "node_modules" in root or ".venv" in root:
            continue
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    modified = False
                    
                    # Fix any references to agents to be agents
                    if "agents" in content:
                        content = content.replace("agents", "agents")
                        modified = True
                        
                    if modified:
                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(content)
                        print(f"Updated imports in py file: {file_path}")
                except Exception as e:
                    pass

if __name__ == "__main__":
    restore_structure()
    update_imports(ROOT_DIR)
    print("Reorganization and restoration completed successfully!")
