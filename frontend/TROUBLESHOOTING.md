# 🔧 Troubleshooting Guide

Complete guide to fix common integration issues.

---

## 🚨 Top Issues & Solutions

### 1. CORS Error

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/students' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Root Cause:**
Backend doesn't have CORS enabled or frontend origin is not whitelisted.

**Solutions:**

**Step 1:** Verify CORS is installed
```bash
cd ../  # Go to backend
npm list cors
```

If not installed:
```bash
npm install cors
```

**Step 2:** Verify CORS is in app.js
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Step 3:** Restart backend
```bash
npm start
```

**Step 4:** Try again
Refresh frontend (Ctrl+Shift+R to clear cache)

---

### 2. Backend Not Running

**Error Message:**
```
TypeError: Failed to fetch
```

**Root Cause:**
Backend server is not running on port 5000.

**Solutions:**

**Step 1:** Check if backend is running
```bash
cd ../  # Go to backend root
npm start
```

You should see:
```
Server running on port 5000
```

**Step 2:** Verify port 5000
```bash
# Windows PowerShell
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

If something is on port 5000, kill it or use different port.

**Step 3:** Check .env
Verify `VITE_API_BASE_URL` in frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

**Step 4:** Restart frontend
```bash
cd frontend
npm run dev
```

---

### 3. 404 Student Not Found

**Error Message:**
```
Error: HTTP Error: 404
```

**Root Cause:**
- Student ID doesn't exist
- Wrong endpoint
- Database connection issue

**Solutions:**

**Step 1:** Check MongoDB is running
```bash
# Windows - Check MongoDB is running in Services
# Or manually:
mongod
```

**Step 2:** Check database connection
Look for connection error in backend terminal:
```
MongoDB connection failed...
```

**Step 3:** Verify student exists in database
Use MongoDB Compass:
1. Connect to `mongodb://localhost:27017`
2. Navigate to `student_management` database
3. View `students` collection
4. Check if student with that `_id` exists

**Step 4:** Check API URL format
Verify you're using MongoDB `_id`, not custom `id`:
```javascript
// ✅ Correct
student._id

// ❌ Wrong
student.id
```

---

### 4. Validation Error

**Error Message:**
```
Error: Validation error: name is required
```

**Root Cause:**
Missing required field in form or invalid data.

**Solutions:**

**Step 1:** Check form inputs
Make sure all fields are filled:
- Name (2-100 characters)
- Age (15-60)
- Course (2-100 characters)

**Step 2:** Frontend validation happens first
The form won't submit if validation fails. Check error message on form.

**Step 3:** Check backend logs
If form submits but backend rejects:
```bash
# Look in backend terminal for detailed error
```

**Step 4:** Test with valid data
Try adding this student:
```
Name: John Doe
Age: 20
Course: Computer Science
```

---

### 5. Data Not Persisting

**Issue:**
Student added but disappears after refresh.

**Root Cause:**
- Data saved to frontend state, not database
- MongoDB not connected
- Save API call failed silently

**Solutions:**

**Step 1:** Check MongoDB is running
```bash
# Check MongoDB service
mongod
```

**Step 2:** Check backend logs
Terminal should show:
```
POST /api/students - 201 Created
```

If it shows 500, there's a backend error.

**Step 3:** Check MongoDB Compass
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Go to `student_management` → `students`
4. Check if document exists

If not there, backend didn't save.

**Step 4:** Enable verbose logging
Add to backend to see exact error:
```javascript
console.log('Saving student:', req.body);
```

---

### 6. Slow API Responses

**Issue:**
API calls take 5+ seconds to respond.

**Root Cause:**
- MongoDB query is slow
- Network latency
- Backend is processing something else

**Solutions:**

**Step 1:** Check network
Use DevTools Network tab (F12):
1. Open dashboard
2. See how long request takes
3. If > 1 second, investigate

**Step 2:** Check MongoDB
1. Check database size
2. Add indexes if needed
3. Test query directly:
   ```javascript
   db.students.find({}).count()
   ```

**Step 3:** Check backend logs
See if endpoint is being called:
```bash
# Add to your controller
console.time('getAllStudents');
console.timeEnd('getAllStudents');
```

**Step 4:** Scale up
- Paginate results
- Add caching
- Optimize queries

---

### 7. Duplicate Students After Add

**Issue:**
Adding student creates 2+ entries.

**Root Cause:**
- Form submitted twice (double-click)
- useEffect runs twice (dev mode)
- Optimistic update + real update both save

**Solutions:**

**Step 1:** Disable button during submit
```javascript
<Button disabled={loading}>Add</Button>
```

**Step 2:** Prevent form resubmission
```javascript
const [submitted, setSubmitted] = useState(false);

if (submitted) return; // Prevent double submit

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitted(true);
  // ... submit logic
};
```

**Step 3:** Check useEffect
React 18 runs effects twice in strict mode (dev only).
This is normal and helps find bugs.

---

### 8. Edit Form Shows Wrong Data

**Issue:**
When clicking Edit, form shows different student's data.

**Root Cause:**
- Wrong student passed to form
- State not updating
- React key issue

**Solutions:**

**Step 1:** Check React key
Ensure `key={student._id}` on list items:
```javascript
{students.map(s => (
  <StudentCard key={s._id} {...} />
))}
```

**Step 2:** Check state management
Verify correct student passed:
```javascript
const handleEditClick = (student) => {
  console.log('Editing:', student); // Debug
  setEditingStudent(student);
  setShowForm(true);
};
```

**Step 3:** Check form pre-population
useEffect should update form when editingStudent changes:
```javascript
useEffect(() => {
  if (editingStudent) {
    setFormData({...editingStudent});
  }
}, [editingStudent]);
```

---

### 9. Delete Not Working

**Issue:**
Delete button doesn't delete student.

**Root Cause:**
- Wrong ID passed
- DELETE endpoint not working
- Permissions issue

**Solutions:**

**Step 1:** Check network request
DevTools → Network → Find DELETE request
- Should be: DELETE /api/students/{id}
- Should return 200 OK

**Step 2:** Check MongoDB
After delete attempt, check if document still exists in MongoDB Compass.

**Step 3:** Test directly
Use curl or Postman:
```bash
curl -X DELETE http://localhost:5000/api/students/{id}
```

**Step 4:** Check ID format
Must be valid MongoDB ObjectId:
```javascript
// ✅ Correct
student._id // "507f1f77bcf86cd799439011"

// ❌ Wrong  
student.id // "123"
```

---

### 10. Search Not Working

**Issue:**
Search returns no results or wrong results.

**Root Cause:**
- Search query malformed
- Backend search not implemented
- Case-sensitivity issue

**Solutions:**

**Step 1:** Check backend search
Verify endpoint accepts `?search=` parameter:
```javascript
// Backend controller
const { search = '' } = req.query;
```

**Step 2:** Test in backend
Direct database query:
```javascript
db.students.find({
  $or: [
    { name: /search-term/i },
    { course: /search-term/i }
  ]
})
```

**Step 3:** Test in frontend
Open DevTools console:
```javascript
await studentService.searchStudents("Computer");
```

**Step 4:** Check capitalization
Search is case-insensitive (use `/i` flag in regex).

---

## 📊 Diagnostic Checklist

Before reporting issue, check:

- [ ] Backend running (`npm start`)
- [ ] Frontend running (`npm run dev`)
- [ ] MongoDB running (`mongod`)
- [ ] CORS middleware added to backend
- [ ] `.env` file exists in frontend
- [ ] `VITE_API_BASE_URL=http://localhost:5000`
- [ ] No console errors (F12)
- [ ] Backend terminal shows incoming requests
- [ ] MongoDB Compass shows data

---

## 🔍 Debug Commands

### Check if Port is Open
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :5000
lsof -i :3000
```

### Restart Services
```bash
# Backend
cd ../
npm start

# Frontend (new terminal)
cd frontend
npm run dev

# MongoDB (if local)
mongod
```

### Test API Directly
```bash
# Test GET all students
curl http://localhost:5000/api/students

# Test POST (create)
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","age":20,"course":"CS"}'

# Test DELETE
curl -X DELETE http://localhost:5000/api/students/{id}
```

---

## 📝 Error Log Locations

### Frontend Console
```
F12 → Console tab
Shows JavaScript errors and network issues
```

### Backend Terminal
```
Where you ran "npm start"
Shows API requests and backend errors
```

### MongoDB Logs
```
Where you ran "mongod"
Shows database connection issues
```

---

## 🆘 Still Stuck?

1. **Clear cache & restart**
   ```bash
   # Frontend
   Ctrl+Shift+R (hard refresh)
   
   # Services
   Kill all: npm start, npm run dev, mongod
   Wait 5 seconds
   Restart all
   ```

2. **Check GitHub Issues**
   Look for similar problems reported

3. **Enable verbose logging**
   Add `console.log()` at each step

4. **Simplify & test**
   - Test with Postman/curl first
   - Test frontend separately
   - Test backend separately

5. **Check timestamps**
   Make sure you've restarted after file changes

---

**Need more help? Check the other documentation files:**
- `API_INTEGRATION.md` - Integration overview
- `API_REFERENCE.md` - API endpoint details
- Backend README - Backend-specific issues

---

**Last Updated:** April 22, 2026
