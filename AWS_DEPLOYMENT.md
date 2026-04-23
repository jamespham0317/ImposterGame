# AWS Deployment Guide

## Quick Setup

### 1. Backend (EC2 Instance)

1. SSH into your EC2 instance
2. Clone the repository and install dependencies:
   ```bash
   cd /path/to/ImposterGame
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the **project root** with:
   ```
   HOST=0.0.0.0
   PORT=8765
   CHEATCODE_ENGINE_API_KEY=your_actual_key
   ALLOW_LOCAL_TEST_EXECUTION=true
   MIN_PLAYERS_TO_START=1
   MIN_PLAYERS_TO_CONTINUE=1
   MAX_WS_MESSAGE_BYTES=65536
   MAX_PLAYER_ID_LENGTH=24
   MAX_CHAT_MESSAGE_LENGTH=600
   MAX_CODE_LENGTH=30000
   HEALTH_ENDPOINT_ENABLED=true
   
   # Frontend Configuration (used during build)
   VITE_BACKEND_URL=ws://54.123.45.67:8765
   VITE_MIN_PLAYERS_TO_START=1
   ```

4. Run the server:
   ```bash
   python -m backend.server
   # Or if not in the right directory:
   python server.py
   ```

5. Verify it's running:
   - The server should print: `Running on ws://0.0.0.0:8765`

### 2. Security Group Configuration (AWS Console)

- Allow inbound traffic on port 8765 from:
  - Your EC2 security group (for internal communication)
  - 0.0.0.0/0 (for all external connections)
- Note: Consider restricting this for production

### 3. Frontend Deployment

After getting your EC2 instance's public IP (let's say `54.123.45.67`):

1. In the project root `.env`, update:
   ```
   VITE_BACKEND_URL=ws://54.123.45.67:8765
   ```

2. Build the frontend:
   ```bash
   cd frontend/ImposterGame
   npm run build
   ```

3. Deploy to your hosting (Vercel, etc.) or serve from EC2

## Local Development (No Changes Needed)

Your existing setup continues to work with a single `.env` file at the project root:
- Backend reads: `HOST`, `PORT`, `CHEATCODE_ENGINE_API_KEY`, etc.
- Frontend reads: `VITE_BACKEND_URL`, `VITE_MIN_PLAYERS_TO_START` (during build)
- Defaults: `VITE_BACKEND_URL=ws://localhost:8765`

## Troubleshooting

### Connection refused error on frontend?
- Verify EC2 Security Group allows port 8765 inbound
- Check that the backend is actually running on the EC2 instance
- Ensure `VITE_BACKEND_URL` has the correct IP and port

### Port already in use?
- Change the PORT in `.env` to something else (e.g., 8766)
- Or kill the process using that port

### Firewall issues?
- AWS Security Groups control inbound/outbound traffic
- Ensure the rule targets port 8765 TCP
