# 🚀 Quick Start - Running on Localhost

## Option 1: Using the Start Script (Easiest)

```bash
cd "/Users/nikhilpanchani/Downloads/8th SEM/farmconnect"
./start.sh
```

This will automatically:
- Install dependencies (if needed)
- Start backend on http://localhost:5001
- Start frontend on http://localhost:5173
- Open both in your browser

Press `Ctrl+C` to stop all servers.

---

## Option 2: Manual Start (Two Terminals)

### Terminal 1 - Backend
```bash
cd "/Users/nikhilpanchani/Downloads/8th SEM/farmconnect/backend"
npm install  # First time only
npm run dev
```

### Terminal 2 - Frontend
```bash
cd "/Users/nikhilpanchani/Downloads/8th SEM/farmconnect/frontend"
npm install  # First time only
npm run dev
```

---

## 🌐 Access the Application

Open your browser and go to: **http://localhost:5173**

---

## ✅ What's Already Configured

- ✅ MongoDB Atlas connection (cloud database)
- ✅ Clerk authentication
- ✅ API URL pointing to localhost:5001
- ✅ All environment variables set
- ✅ Dev scripts configured

---

## 📝 First Time Setup

If this is your first time running the project:

1. **Install dependencies** (automatic with start.sh, or run `npm install` in both folders)
2. **Start servers** (use start.sh or manual method)
3. **Open browser** to http://localhost:5173
4. **Sign up** with your email
5. **Choose role**: Farmer, Buyer, or Service Provider
6. **Start exploring!**

---

## 🔧 Troubleshooting

### Port already in use?
```bash
# Kill process on port 5001 (backend)
kill -9 $(lsof -ti:5001)

# Kill process on port 5173 (frontend)
kill -9 $(lsof -ti:5173)
```

### Need to restart?
Press `Ctrl+C` in the terminal and run `./start.sh` again

### Changes not showing?
- Backend: Nodemon auto-reloads (no restart needed)
- Frontend: Vite hot-reloads (no restart needed)
- Environment variables: Restart required

---

## 📚 Full Documentation

For detailed setup instructions, troubleshooting, and more:
- See: `localhost_setup_guide.md` in the brain folder
- See: `project_analysis.md` for complete project documentation

---

## 🎯 Quick Test

1. Go to http://localhost:5173
2. Click "Get Started"
3. Sign up as a Farmer
4. Add a crop listing
5. Sign up as a Buyer (different email)
6. Browse crops and place a bid
7. Go back to Farmer account
8. Accept the bid
9. Start chatting!

---

**That's it! Happy coding! 🎉**
