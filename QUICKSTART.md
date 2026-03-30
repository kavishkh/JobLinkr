# Quick Start Guide - JobLinkr

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Create a file named `.env.local` in the root directory:

```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

**How to get a Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env.local`

### Step 3: Start Development Server
```bash
npm run dev
```

Your application will be running at **http://localhost:3000**

---

## 📋 Testing the New Features

### Test Resume Analyzer
1. Navigate to **http://localhost:3000/profile/analyzer**
2. Upload a sample PDF resume
3. Enter a target role (e.g., "Frontend Developer")
4. (Optional) Paste a job description
5. Click "Analyze Resume"
6. View AI-powered insights!

### Test AI Matcher
1. Navigate to **http://localhost:3000/matcher**
2. Upload your resume
3. Enter target role and preferences
4. Click "Start Market Search"
5. Swipe through matched jobs!

### Verify Bug Fix
The duplicate key error should now be fixed. Check the browser console - no more `ext-undefined` errors!

---

## 🛠️ Common Issues & Solutions

### Issue: "Module not found: pdf-parse"
**Solution**: Run `npm install` again

### Issue: "AI analysis failed"
**Solution**: Check that your `.env.local` has a valid Gemini API key

### Issue: "Cannot parse PDF"
**Solution**: Ensure the PDF is not password-protected and is under 5MB

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Windows PowerShell
Get-Process node | Stop-Process -Force

# Or use a different port
npm run dev -- -p 3001
```

---

## 📦 What's Included

### New Pages
- ✅ `/profile/analyzer` - Resume Analyzer
- ✅ `/matcher` - Enhanced AI Matcher

### New Features
- ✅ PDF resume parsing
- ✅ AI-powered skills extraction
- ✅ Job description matching
- ✅ Match scoring (0-100)
- ✅ Strengths/weaknesses analysis
- ✅ Personalized recommendations

### Fixed Issues
- ✅ Duplicate key error (`ext-undefined`)
- ✅ Better error handling
- ✅ Improved API rate limiting

---

## 🎯 Next Steps

1. **Explore the Resume Analyzer** - See how AI analyzes your resume
2. **Try the AI Matcher** - Find jobs that match your profile
3. **Browse Jobs** - Search through real-time job listings
4. **Customize Your Profile** - Update your personal information

---

## 📚 Documentation

- **Full README**: See `README.md` for complete documentation
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **API Docs**: 
  - [Google Gemini](https://ai.google.dev/docs)
  - [Arbeitnow API](https://arbeitnow.com/api-documentation)

---

## 💡 Tips for Best Results

### For Resume Analysis:
- Use PDF format for best parsing results
- Include clear section headings (Experience, Education, Skills)
- Keep formatting simple (avoid complex layouts)

### For AI Matching:
- Be specific about your target role
- Upload your most recent resume
- Try different job types (Remote, Full-time, etc.)

### For Job Search:
- Use relevant keywords in search
- Try multiple filters to refine results
- Check back regularly - jobs auto-refresh every 2 minutes

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Console**: Look for error messages in browser DevTools
2. **Verify Environment**: Ensure `.env.local` is set up correctly
3. **Restart Server**: Stop and restart `npm run dev`
4. **Clear Cache**: Run `npm run clean` then restart

---

## ✅ Success Checklist

Before you start developing, verify:

- [ ] Dependencies installed (`node_modules` exists)
- [ ] `.env.local` file created with API key
- [ ] Development server running without errors
- [ ] Can access http://localhost:3000
- [ ] Resume Analyzer page loads
- [ ] AI Matcher page loads
- [ ] No console errors

If all checkboxes are ✅, you're ready to go! 🎉

---

**Happy Coding! 🚀**
