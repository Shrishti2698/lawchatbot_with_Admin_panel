# Troubleshooting Admin Panel

## Issue: Pages stuck on "Loading..."

### Quick Fixes:

### 1. Check Backend is Running
```bash
cd backend
python main.py
```
Should see: `Uvicorn running on http://127.0.0.1:8000`

### 2. Test Backend Directly
Open browser: `http://localhost:8000/health`

**Expected:** JSON response with health status
**If fails:** Backend not running or crashed

### 3. Check Browser Console
Press F12 → Console tab

**Common Errors:**

#### "Network Error" or "ERR_CONNECTION_REFUSED"
→ Backend not running on port 8000

#### "CORS policy" error
→ Backend CORS not configured (should be fixed in main.py)

#### "404 Not Found"
→ Endpoint doesn't exist (check backend has all routes)

### 4. Check ChromaDB Exists
```bash
# Should see chroma_db folder
ls ../chroma_db
```

**If missing:** Run initial data ingestion or upload a document first

### 5. Check Data Folder
```bash
# Should see PDF files
ls ../data
```

### 6. Test Individual Endpoints

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Documents List:**
```bash
curl http://localhost:8000/documents
```

**Vector Store Stats:**
```bash
curl http://localhost:8000/vectorstore/stats
```

## Common Solutions:

### Backend Crashes on Startup
- Install missing dependencies: `pip install -r requirements.txt`
- Check .env file exists with credentials
- Verify Python version (3.10+)

### "Collection not found" Error
- ChromaDB not initialized
- Upload a document first to create collection
- Or run data ingestion script

### CORS Errors
Backend main.py should have:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Port Already in Use
```bash
# Kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

## Still Not Working?

1. Check backend terminal for error messages
2. Check browser console (F12) for detailed errors
3. Try uploading a document first (Upload page works)
4. Restart both backend and frontend
