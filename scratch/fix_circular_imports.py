import os

ROOT_DIR = r"C:\CODING\PROJECTS\Procura\backend\app"
MODELS_DIR = os.path.join(ROOT_DIR, "models")

def fix_imports():
    for root, dirs, files in os.walk(MODELS_DIR):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    modified = False
                    if "from backend.app.db.base import Base" in content:
                        content = content.replace("from backend.app.db.base import Base", "from backend.app.db.base_class import Base")
                        modified = True
                        
                    if modified:
                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(content)
                        print(f"Updated Base import in model: {file_path}")
                except Exception as e:
                    print(f"Error reading/writing {file_path}: {e}")

if __name__ == "__main__":
    fix_imports()
