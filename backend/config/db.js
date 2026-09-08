const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

// Force l'utilisation des WebSockets (contourne les pare-feux et erreurs ETIMEDOUT sur le port 5432)
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

module.exports = pool;