# Inventory Backend (Node.js + Express + MySQL)

## Local dev
```
cp .env.sample .env   # put your PlanetScale credentials
npm install
npm run dev
```

## Render deploy
- New Web Service → Select your GitHub repo
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Add Environment Variables from `.env`
