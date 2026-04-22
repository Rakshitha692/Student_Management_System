# 🔌 Backend Integration Guide

## Current State
- Frontend: ✅ Complete with mock data
- Backend: ✅ Ready (Node.js + Express + MongoDB)
- Status: Disconnected (by design for this phase)

---

## Step-by-Step Integration

### Step 1: Test Your Backend Locally

Ensure your backend is running:
```bash
cd ../  # Go back to root
node server.js
# Should see: Server running on http://localhost:5000
```

---

### Step 2: Add Environment Configuration

Create `.env.local` in `frontend/` folder:
```env
REACT_APP_API_URL=http://localhost:5000
```

> **Note:** Vite requires `REACT_APP_` prefix for client-side env vars

---

### Step 3: Update studentService.js

**BEFORE (Current Mock Setup):**
```javascript
const API_DELAY = 500;
const simulateDelay = () => 
  new Promise(resolve => setTimeout(resolve, API_DELAY));

export const fetchStudents = async () => {
  await simulateDelay();
  return [...mockStudents];
};
```

**AFTER (Real API):**
```javascript
const API_URL = import.meta.env.REACT_APP_API_URL;

export const fetchStudents = async () => {
  const response = await fetch(`${API_URL}/api/students`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};
```

---

### Step 4: Update All Service Methods

```javascript
/**
 * Add new student
 * BEFORE: mockStudents.push(newStudent)
 * AFTER: POST to backend
 */
export const addStudent = async (studentData) => {
  const response = await fetch(`${API_URL}/api/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to add student');
  }
  return await response.json();
};

/**
 * Update student
 */
export const updateStudent = async (id, studentData) => {
  const response = await fetch(`${API_URL}/api/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update student');
  }
  return await response.json();
};

/**
 * Delete student
 */
export const deleteStudent = async (id) => {
  const response = await fetch(`${API_URL}/api/students/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete student');
  }
  return await response.json();
};

/**
 * Search students
 */
export const searchStudents = async (query) => {
  const response = await fetch(
    `${API_URL}/api/students/search?q=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search students');
  }
  return await response.json();
};
```

---

### Step 5: CORS Configuration (Backend)

Your `app.js` needs CORS headers to allow frontend to access:

```javascript
// In your backend src/config/app.js
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
```

If you haven't installed CORS:
```bash
npm install cors
```

---

### Step 6: Start Both Servers

**Terminal 1 (Backend):**
```bash
cd ../
npm start  # or node server.js
# Backend running on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Frontend running on http://localhost:3000
```

---

### Step 7: Test Integration

1. Open http://localhost:3000 in browser
2. Navigate to Dashboard
3. All operations should now hit your backend!

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:5000/api/students' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
```javascript
// Backend app.js
import cors from 'cors';
app.use(cors());
```

---

### Issue 2: 404 on API Call
```
POST http://localhost:5000/api/students 404 (Not Found)
```

**Solution:**
- Check backend is running
- Check API endpoint exists in your backend routes
- Verify URL in `studentService.js` matches backend routes

---

### Issue 3: Network Error
```
TypeError: Failed to fetch
Network error when attempting to fetch resource.
```

**Solution:**
- Check backend is running on port 5000
- Check firewall isn't blocking localhost:5000
- Check `.env.local` has correct API URL

---

## 🧪 Testing the Integration

### Manual Testing Checklist

- [ ] Can view all students from backend
- [ ] Can add new student (persists in database)
- [ ] Can edit student (updates in database)
- [ ] Can delete student (removes from database)
- [ ] Can search students
- [ ] Loading spinner shows during requests
- [ ] Error messages show if API fails
- [ ] Form validation still works

---

## 🔒 Error Handling Enhancement

Add better error handling in DashboardPage:

```javascript
const handleAddClick = async (formData) => {
  setFormLoading(true);
  try {
    await handleAddStudent(formData);
    setShowForm(false);
    setEditingStudent(null);
    setLocalError(null);
  } catch (err) {
    console.error('Error:', err);
    // Show specific error to user
    if (err.message.includes('400')) {
      setLocalError('Invalid student data');
    } else if (err.message.includes('500')) {
      setLocalError('Server error. Please try again later.');
    } else {
      setLocalError(err.message || 'Failed to add student');
    }
  } finally {
    setFormLoading(false);
  }
};
```

---

## 📊 Data Validation Flow

```
Frontend Form Input
    ↓
Frontend Validation (validateStudent.js)
    ↓
Send to Backend
    ↓
Backend Validation (Express middleware)
    ↓
Save to MongoDB
    ↓
Return Result to Frontend
```

**Important:** Always validate on BOTH frontend and backend!

---

## 🔄 API Response Format

Your backend should return students in this format:

```javascript
// GET /api/students
[
  {
    "_id": "507f1f77bcf86cd799439011",  // MongoDB ID
    "name": "Aarav Patel",
    "age": 20,
    "course": "Computer Science",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  // ... more students
]

// POST /api/students
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "New Student",
  "age": 19,
  "course": "IT",
  "createdAt": "2024-01-15T11:00:00Z"
}
```

**Note:** Update service if your API returns different format

---

## 📝 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` |
| `REACT_APP_ENV` | Environment name | `development`, `production` |

---

## 🚀 Production Deployment

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

### Deployment Options
1. **Vercel** (easiest for React)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

3. **GitHub Pages**
   ```bash
   npm run build
   # Copy dist/ to gh-pages branch
   ```

---

## ✅ Integration Checklist

- [ ] Backend running on `localhost:5000`
- [ ] `.env.local` created with `REACT_APP_API_URL`
- [ ] `studentService.js` updated with fetch() calls
- [ ] CORS enabled on backend
- [ ] API endpoints working (test with Postman)
- [ ] Frontend loads students from API
- [ ] CRUD operations work
- [ ] Error handling implemented
- [ ] Loading states show
- [ ] No console errors

---

## 📚 Further Reading

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [React Network Requests](https://react.dev/learn/synchronizing-with-effects)

---

**Ready to connect? Update `studentService.js` and let's go! 🚀**
