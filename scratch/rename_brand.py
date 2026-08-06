import os

TARGET_DIR = r"C:\CODING\PROJECTS\procura"
EXCLUDE_DIRS = {".git", "node_modules", "dist", "__pycache__", ".pytest_cache"}

def replace_in_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        modified = False
        
        # Replace occurrences keeping cases
        if "PROCURA" in content:
            content = content.replace("PROCURA", "PROCURA")
            modified = True
        if "Procura" in content:
            content = content.replace("Procura", "Procura")
            modified = True
        if "procura" in content:
            content = content.replace("procura", "procura")
            modified = True
            
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated: {file_path}")
    except Exception as e:
        # Ignore binary or unreadable files
        pass

def walk_and_replace(directory):
    for root, dirs, files in os.walk(directory):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            file_path = os.path.join(root, file)
            replace_in_file(file_path)

if __name__ == "__main__":
    walk_and_replace(TARGET_DIR)
    print("Brand renaming completed successfully!")
