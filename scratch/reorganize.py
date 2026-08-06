import os
import shutil

ROOT_DIR = r"C:\CODING\PROJECTS\veridion"
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
AGENTS_DIR = os.path.join(ROOT_DIR, "agents")
BACKEND_AGENTS_SRC = os.path.join(ROOT_DIR, "backend", "app", "agents")

def move_frontend_files():
    os.makedirs(FRONTEND_DIR, exist_ok=True)
    items_to_move = [
        "src", "public", "index.html", "package.json", "package-lock.json", 
        "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json", "vite.config.ts", ".oxlintrc.json"
    ]
    for item in items_to_move:
        src_path = os.path.join(ROOT_DIR, item)
        dst_path = os.path.join(FRONTEND_DIR, item)
        if os.path.exists(src_path):
            if os.path.exists(dst_path):
                if os.path.isdir(dst_path):
                    shutil.rmtree(dst_path)
                else:
                    os.remove(dst_path)
            shutil.move(src_path, dst_path)
            print(f"Moved frontend item: {item} -> frontend/{item}")

def move_agents_folder():
    if os.path.exists(BACKEND_AGENTS_SRC):
        if os.path.exists(AGENTS_DIR):
            shutil.rmtree(AGENTS_DIR)
        shutil.move(BACKEND_AGENTS_SRC, AGENTS_DIR)
        print("Moved agents folder: backend/app/agents -> agents")

def update_python_imports(directory):
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
    move_frontend_files()
    move_agents_folder()
    update_python_imports(ROOT_DIR)
    print("Project reorganization completed successfully!")
