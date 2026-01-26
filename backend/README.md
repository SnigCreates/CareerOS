# Backend Setup

## Prerequisites

You need Python 3.8 or higher installed on your system.

### Installing Python on Windows

1. **Download Python:**
   - Go to https://www.python.org/downloads/
   - Download Python 3.11 or 3.12 (latest stable version)
   - **Important:** During installation, check the box "Add Python to PATH"

2. **Verify Installation:**
   ```powershell
   python --version
   pip --version
   ```

## Installation Steps

1. **Navigate to the backend directory:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```
   
   Or if `pip` doesn't work, try:
   ```powershell
   python -m pip install -r requirements.txt
   ```

3. **Run the server:**
   ```powershell
   python server.py
   ```
   
   The server will start on `http://localhost:8000`

## API Endpoints

- **POST** `/optimize` - Optimize resume based on job description
  - Request body: `{ "description": "job description text" }`
  - Response: `{ "status": "success", "message": "...", "optimized_text": "..." }`

## Troubleshooting

### "pip is not recognized"
- Make sure Python was installed with "Add to PATH" option
- Try using `python -m pip` instead of just `pip`
- Restart your terminal after installing Python

### "python is not recognized"
- Python is not installed or not in PATH
- Reinstall Python and ensure "Add to PATH" is checked
- Or install from Microsoft Store: `python` (will open Microsoft Store)
