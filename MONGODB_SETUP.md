# MongoDB Setup Guide for JobLinkr

## Overview
All form data is now stored in MongoDB instead of in-memory or local storage. This includes:
- ✅ User registration & profiles
- ✅ Job applications
- ✅ Posts/Feed content
- ✅ Saved jobs
- ✅ Employer profiles

## Prerequisites
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- Your MongoDB connection string

## Step 1: Get Your MongoDB Connection String

1. Go to **https://cloud.mongodb.com**
2. Sign in or create an account
3. Create a new cluster (use free tier for development)
4. Once your cluster is created, click **"Connect"**
5. Choose **"Connect your application"**
6. Select **Node.js** and copy the connection string
7. The string will look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/joblinkr?retryWrites=true&w=majority
   ```

## Step 2: Configure Environment Variables

1. Open `.env.local` in your project root
2. Add/Update your MongoDB URI:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/joblinkr?retryWrites=true&w=majority
   ```
   
3. Replace:
   - `username` with your MongoDB user
   - `password` with your MongoDB password
   - `cluster-name` with your actual cluster name
   - `joblinkr` with your database name

## Step 3: Create MongoDB User (if not already done)

1. In MongoDB Atlas, go to **Database Access**
2. Click **"Add New Database User"**
3. Create a user with a strong password
4. Give it **"Read and write to any database"** permissions
5. Use this username and password in your connection string

## Step 4: Whitelist Your IP

1. In MongoDB Atlas, go to **Network Access**
2. Click **"Add IP Address"**
3. Choose **"Allow access from anywhere"** (for development) or add your IP
4. Confirm

## Step 5: Test the Connection

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. Try creating a new account - if successful, the user data will be saved to MongoDB

4. To verify the data was saved:
   - Go to MongoDB Atlas
   - Click on your cluster
   - Go to **"Collections"**
   - You should see databases: `joblinkr` with collections like `users`, `applications`, `posts`, etc.

## API Endpoints

### User Management
- **POST** `/api/signup` - Create new user (stored in MongoDB)
- **GET** `/api/user/profile` - Get user profile
- **PUT** `/api/user/profile` - Update user profile

### Job Applications
- **POST** `/api/jobs/apply` - Apply to a job
- **GET** `/api/jobs/apply` - Get user's applications
- **GET** `/api/employer/applications` - Get applications for employer's jobs

### Posts/Feed
- **GET** `/api/posts` - Get all posts
- **POST** `/api/posts` - Create a new post

### Saved Jobs
- **GET** `/api/jobs/saved` - Get user's saved jobs
- **POST** `/api/jobs/saved` - Save/unsave a job
- **DELETE** `/api/jobs/saved` - Remove a saved job

### Employer Profile
- **GET** `/api/employer/profile` - Get employer profile
- **POST** `/api/employer/profile` - Create/update employer profile

## Database Schema

### Users Collection
```json
{
  "email": "user@example.com",
  "passwordHash": "hashed_password",
  "name": "John Doe",
  "role": "Seeker" | "Employer",
  "gender": "male" | "female",
  "age": 25,
  "headline": "Software Engineer",
  "location": "New York",
  "bio": "...",
  "socialLinks": {
    "linkedin": "...",
    "github": "...",
    "portfolio": "...",
    "twitter": "..."
  },
  "skills": [
    { "name": "JavaScript", "level": "Expert" }
  ],
  "experience": [
    { "company": "...", "title": "...", "period": "...", "description": "..." }
  ],
  "education": [
    { "school": "...", "degree": "...", "year": "..." }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Applications Collection
```json
{
  "jobId": "job-123",
  "userId": "user-id",
  "userEmail": "user@example.com",
  "status": "Applied" | "Under Review" | "Rejected" | "Accepted",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Posts Collection
```json
{
  "userId": "user-id",
  "author": {
    "id": "user-id",
    "name": "John Doe",
    "avatar": "url",
    "role": "Seeker" | "Employer"
  },
  "content": "Post content...",
  "likes": 5,
  "comments": 2,
  "shares": 1,
  "liked": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### SavedJobs Collection
```json
{
  "userId": "user-id",
  "jobId": "job-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### EmployerProfiles Collection
```json
{
  "userId": "user-id",
  "companyName": "Tech Corp",
  "industry": "Technology",
  "companySize": "100-500",
  "website": "https://example.com",
  "description": "...",
  "logo": "url",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### "MONGODB_URI is not defined"
- Make sure you've added `MONGODB_URI` to `.env.local`
- Restart your dev server after adding it

### Connection Timeout
- Check if your IP is whitelisted in MongoDB Atlas
- Verify your connection string is correct
- Ensure your MongoDB user credentials are correct

### "User not found" on login
- The old authentication system used Firebase
- Users created before this update won't exist in MongoDB
- Create a new account to test the new system

### Data not persisting
- Check MongoDB Atlas to ensure the database and collections were created
- Verify the API response for errors in the browser console

## Migration from Firebase (Optional)

If you want to migrate existing Firebase data:
1. Export data from Firebase Firestore
2. Transform the data to match MongoDB schemas
3. Import into MongoDB using `mongoimport` or MongoDB Atlas tools

## Production Deployment

For production:
1. Use a strong MongoDB password
2. Use IP whitelisting instead of "Allow from anywhere"
3. Enable MongoDB encryption at rest
4. Set up regular backups in MongoDB Atlas
5. Update `MONGODB_URI` in production environment variables
6. Consider using connection pooling for better performance

## Next Steps

1. Update frontend components to use the new API endpoints
2. Remove localStorage usage for posts/jobs (migrate to API calls)
3. Update authentication to use MongoDB user validation
4. Test all forms to ensure data persists

---

For more help, visit:
- MongoDB Documentation: https://docs.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/
