# Legal Assistant - Admin Panel

React-based admin panel for managing the Legal Assistant knowledge base.

## Features Implemented (Phase 1)

✅ **Authentication**
- JWT-based login with 24hr expiry
- Credentials from `.env` file
- Auto-logout on token expiry

✅ **Dashboard**
- System health overview
- Component status monitoring
- Vector store statistics
- Quick action links

✅ **Document Management**
- List all documents with filters
- Search by filename
- View indexing status
- Delete documents with confirmation

✅ **Upload Documents**
- PDF file upload
- Document type selection
- Advanced chunking options
- Processing statistics display

## Setup

### 1. Install Dependencies

```bash
cd Admin_frontend
npm install
```

### 2. Configure Environment

The `.env` file already contains admin credentials:
```
ADMIN_USERNAME=Shrishti
ADMIN_PASSWORD=34567890@#
```

### 3. Start Backend (Required)

```bash
cd ../backend
pip install -r requirements.txt
python main.py
```

Backend runs on: `http://localhost:8000`

### 4. Start Admin Frontend

```bash
npm run dev
```

Admin panel runs on: `http://localhost:5174`

## Usage

### Login
1. Navigate to `http://localhost:5174/login`
2. Enter credentials:
   - Username: `Shrishti`
   - Password: `34567890@#`
3. JWT token stored in localStorage for 24 hours

### Dashboard
- View system health
- Monitor vector store stats
- Quick access to common actions

### Manage Documents
1. Go to **Documents** page
2. Filter by status (indexed/not indexed)
3. Search by filename
4. Delete documents (requires typing "DELETE")

### Upload New Document
1. Go to **Upload** page
2. Select PDF file
3. Choose document type
4. (Optional) Configure chunk settings
5. Upload and view processing stats

## Project Structure

```
Admin_frontend/
├── src/
│   ├── components/
│   │   ├── DashboardLayout.jsx    # Main layout with sidebar
│   │   └── DeleteConfirmModal.jsx # Delete confirmation
│   ├── pages/
│   │   ├── Login.jsx              # Login page
│   │   ├── Dashboard.jsx          # Dashboard home
│   │   ├── Documents.jsx          # Document list
│   │   └── Upload.jsx             # Upload page
│   ├── services/
│   │   └── api.js                 # API service with axios
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Tailwind styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **JWT** - Authentication

## API Integration

All API calls go through `src/services/api.js`:

- Automatic JWT token injection
- Auto-logout on 401
- Error handling
- Request/response interceptors

## Security

- JWT tokens stored in localStorage
- 24-hour token expiry
- Auto-logout on expiration
- Protected routes
- Confirmation modals for destructive actions

## Next Steps (Phase 2 & 3)

### Phase 2 - Configuration
- [ ] Chunk config editor
- [ ] Reprocess documents
- [ ] Embedding model management
- [ ] Retrieval settings

### Phase 3 - Advanced
- [ ] Test retrieval (debug tool)
- [ ] Vector store rebuild with job tracking
- [ ] Clear vector store
- [ ] System health monitoring

## Troubleshooting

### Backend not responding
- Ensure backend is running on port 8000
- Check CORS settings in backend

### Login fails
- Verify credentials in `.env` match
- Check backend logs for errors
- Ensure JWT_SECRET_KEY is set

### Documents not loading
- Verify ChromaDB is accessible
- Check data folder exists
- Review backend logs

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Notes

- Admin panel runs on port 5174 (separate from user frontend)
- Backend must be running for all features to work
- JWT tokens expire after 24 hours
- All destructive actions require explicit confirmation
