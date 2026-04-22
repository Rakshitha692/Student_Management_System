# 📋 API Reference

Complete documentation of all API endpoints used by the frontend.

---

## Base URL

```
http://localhost:5000
```

All endpoints are prefixed with `/api/students`

---

## Authentication

Currently no authentication required. All endpoints are public.

---

## Endpoints

### 1. Get All Students

**Request:**
```
GET /api/students?page=1&limit=10&search=john
```

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| page | number | Page number (for pagination) | 1 |
| limit | number | Items per page | 10 |
| search | string | Search by name or course | "Computer Science" |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Aarav Patel",
      "age": 20,
      "course": "Computer Science",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

**Frontend Usage:**
```javascript
const students = await studentService.fetchStudents(1, 10, "");
```

---

### 2. Get Single Student

**Request:**
```
GET /api/students/:id
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId of student |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Aarav Patel",
    "age": 20,
    "course": "Computer Science",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Student not found"
}
```

**Frontend Usage:**
```javascript
const student = await studentService.fetchStudentById("507f1f77bcf86cd799439011");
```

---

### 3. Create Student

**Request:**
```
POST /api/students
Content-Type: application/json

{
  "name": "John Doe",
  "age": 20,
  "course": "Computer Science"
}
```

**Request Body:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| name | string | Yes | 2-100 characters |
| age | number | Yes | 15-60 |
| course | string | Yes | 2-100 characters |

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "age": 20,
    "course": "Computer Science",
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "message": "Student created successfully"
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error: name is required"
}
```

**Frontend Usage:**
```javascript
const newStudent = await studentService.addStudent({
  name: "John Doe",
  age: 20,
  course: "Computer Science"
});
```

---

### 4. Update Student

**Request:**
```
PUT /api/students/:id
Content-Type: application/json

{
  "name": "John Smith",
  "age": 21,
  "course": "Data Science"
}
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId of student |

**Request Body:**
Same as Create Student endpoint.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Smith",
    "age": 21,
    "course": "Data Science",
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:30:00Z"
  },
  "message": "Student updated successfully"
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Student not found"
}
```

**Frontend Usage:**
```javascript
const updated = await studentService.updateStudent(
  "507f1f77bcf86cd799439012",
  {
    name: "John Smith",
    age: 21,
    course: "Data Science"
  }
);
```

---

### 5. Delete Student

**Request:**
```
DELETE /api/students/:id
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId of student |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Student not found"
}
```

**Frontend Usage:**
```javascript
await studentService.deleteStudent("507f1f77bcf86cd799439012");
```

---

## Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error (check message) |
| 404 | Not Found | Student not found |
| 500 | Internal Server Error | Backend error (check server logs) |

---

## Response Format

All responses follow this format:

```json
{
  "success": true/false,
  "data": {},
  "message": "Optional message",
  "pagination": {} // Only for GET /students
}
```

---

## Example Requests (using fetch)

### Get All Students
```javascript
const response = await fetch('http://localhost:5000/api/students?page=1&limit=10');
const result = await response.json();
console.log(result.data); // Array of students
```

### Add Student
```javascript
const response = await fetch('http://localhost:5000/api/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Alice",
    age: 19,
    course: "Web Dev"
  })
});
const result = await response.json();
console.log(result.data); // New student
```

### Update Student
```javascript
const response = await fetch(
  'http://localhost:5000/api/students/507f1f77bcf86cd799439012',
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: "Bob",
      age: 20,
      course: "Mobile Dev"
    })
  }
);
const result = await response.json();
console.log(result.data); // Updated student
```

### Delete Student
```javascript
const response = await fetch(
  'http://localhost:5000/api/students/507f1f77bcf86cd799439012',
  { method: 'DELETE' }
);
const result = await response.json();
console.log(result.message); // Success message
```

---

## Data Types

### Student Object
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "string (2-100 chars)",
  "age": "number (15-60)",
  "course": "string (2-100 chars)",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

---

## Rate Limiting

Currently no rate limiting. Production should implement rate limiting to prevent abuse.

---

## Pagination

For large datasets, use pagination:

```javascript
// Get page 2 with 5 items per page
await fetch('http://localhost:5000/api/students?page=2&limit=5');
```

Response includes:
```json
{
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 50
  }
}
```

---

## Search

Search by name or course:

```javascript
// Search for "Computer Science"
await fetch('http://localhost:5000/api/students?search=Computer%20Science');
```

Frontend implementation:
```javascript
await studentService.searchStudents("Computer Science");
```

---

## Validation Rules

### Name
- Required
- Minimum 2 characters
- Maximum 100 characters

### Age
- Required
- Minimum 15
- Maximum 60
- Must be a valid number

### Course
- Required
- Minimum 2 characters
- Maximum 100 characters

---

## Best Practices

1. **Always check response.ok before processing**
   ```javascript
   if (!response.ok) throw new Error('API call failed');
   ```

2. **Handle errors gracefully**
   ```javascript
   try {
     const data = await fetchStudents();
   } catch (error) {
     console.error('Failed to fetch:', error);
     // Show user-friendly message
   }
   ```

3. **Use useCallback in React for memoization**
   ```javascript
   const loadStudents = useCallback(async () => {
     // ...
   }, []);
   ```

4. **Implement loading states**
   ```javascript
   setLoading(true);
   try {
     // API call
   } finally {
     setLoading(false);
   }
   ```

---

## Frontend Integration

The frontend uses this service layer to abstract API calls:

```javascript
// src/services/studentService.js
export const fetchStudents = async () => {...}
export const fetchStudentById = async (id) => {...}
export const addStudent = async (data) => {...}
export const updateStudent = async (id, data) => {...}
export const deleteStudent = async (id) => {...}
export const searchStudents = async (query) => {...}
```

Components call these functions, which handle all API communication.

---

**Last Updated:** April 22, 2026
**API Version:** v1
**Status:** Production Ready
