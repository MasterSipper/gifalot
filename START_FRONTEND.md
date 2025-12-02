# Starting the Frontend

## Step 1: Install Dependencies

First, install frontend dependencies:

```cmd
cd C:\Projects\Gifalot\gif-j-react
npm install
```

This will install all React dependencies (takes a few minutes).

## Step 2: Check Backend Port

Your backend is running on port 3001 (from your .env file), but the frontend is configured to connect to port 3000.

**Option A: Update Frontend API URL**

Create or edit `gif-j-react\.env` file:

```env
REACT_APP_API_URL=http://localhost:3001/gif-j/
```

**Option B: Change Backend Port**

Edit `gif-j-backend\.env` and change:
```env
PORT=3000
```

Then restart the backend.

## Step 3: Start Frontend

```cmd
cd C:\Projects\Gifalot\gif-j-react
npm start
```

This will:
- Start the React development server
- Open browser to http://localhost:3000 (or next available port)
- Automatically reload when you make changes

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, React will ask to use a different port (like 3001).

### Cannot Connect to Backend

1. **Check backend is running:**
   ```cmd
   curl http://localhost:3001/gif-j/
   ```

2. **Check API URL in frontend:**
   - Make sure `REACT_APP_API_URL` in `.env` matches backend port
   - Default: `http://localhost:3000/gif-j/` or `http://localhost:3001/gif-j/`

3. **Check CORS:**
   - Backend should have CORS enabled (it does by default)

### Frontend Shows Blank Page

1. Check browser console for errors (F12)
2. Check terminal for compilation errors
3. Make sure backend is running and accessible










