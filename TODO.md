# TODO - Run Translation App

## Quick Start
1. Kill ports: `npx kill-port 5000 3000`
2. Copy server/.env.example → server/.env
3. Setup MongoDB Atlas:
   - mongodb.com/atlas (free)
   - Create M0 cluster
   - Add Network Access: 0.0.0.0/0
   - Create DB user
   - Update MONGO_URI in server/.env
4. `cd server && npm run dev` (port 5000)
5. `cd client && npm start` (port 3000)
6. Open http://localhost:3000

## Features Ready
- Text/Document/Video/Camera/Chat Translation
- User Auth & History
- Real-time Socket.io Chat

✅ Dependencies installed ✅ Servers starting (ports fixed)
