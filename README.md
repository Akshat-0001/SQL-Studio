# Cipher SQL Studio

this is my submission for the full stack assignment. it's a simple web app that lets you run real sql queries against sample databases right in the browser. 

I built it using react for the frontend and express/postgres/mongo for the backend. kept the code as simple as possible without overengineering it.

## how to run it

you'll need your own `.env` file in the root directory first with these keys:
- `MONGO_URI`
- `POSTGRES_URI`
- `GROQ_API_KEY` (this is for the hint feature)

**to start backend:**
1. `cd backend`
2. `npm install`
3. `node index.js`
(it will automatically seed the database data from the json file on first run)

**to start frontend:**
1. `cd frontend`
2. `npm install`
3. `npm run dev`

then just open your browser to `http://localhost:5173` and you're good to go!

## features
- lists all assignments from mongo
- neo-brutalist custom styling
- sql editor using monaco
- runs actual postgres queries and compares output
- ai hints with groq if u get stuck
