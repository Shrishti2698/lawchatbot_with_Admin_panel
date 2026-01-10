# Quick Start Guide - Admin Panel

## 🚀 Get Started in 3 Steps

### Step 1: Start Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
✅ Backend running on http://localhost:8000

### Step 2: Start Admin Frontend
```bash
cd Admin_frontend
npm install
npm run dev
```
✅ Admin panel running on http://localhost:5174

### Step 3: Login
- Open http://localhost:5174/login
- Username: `Shrishti`
- Password: `34567890@#`

## ✨ What You Can Do Now

### 1. View Dashboard
- System health status
- Total documents & chunks
- Component status
- Quick actions

### 2. Manage Documents
- List all PDFs
- Filter by status
- Search documents
- Delete with confirmation

### 3. Upload New Law
- Select PDF file
- Choose document type (BNS, IPC, etc.)
- Configure chunk settings (optional)
- View processing stats

## 📋 Phase 1 Complete!

✅ Authentication (JWT, 24hr expiry)
✅ Dashboard with stats
✅ Document list & management
✅ Upload with processing
✅ Delete with "TYPE DELETE" confirmation

## 🎯 Coming in Phase 2

- Chunk configuration editor
- Reprocess existing documents
- Embedding model management
- Retrieval settings tuning

## 🎯 Coming in Phase 3

- Test retrieval (debug tool)
- Vector store rebuild
- Clear vector store
- Advanced monitoring

## 🔧 Troubleshooting

**Can't login?**
- Check backend is running
- Verify credentials in `.env`

**Documents not showing?**
- Ensure ChromaDB exists
- Check `data/` folder has PDFs

**Upload fails?**
- Only PDF files allowed
- Check backend logs
- Verify disk space

## 📞 Need Help?

Check the full README.md for detailed documentation.
