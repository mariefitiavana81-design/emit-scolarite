require('dotenv').config();
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure le WebSockets pour outrepasser les blocages réseau
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkConnection() {
  try {
    console.log("Tentative de connexion via WebSockets HTTP/443...");
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connexion réussie à Neon PostgreSQL !');
    console.log('🕒 Heure serveur :', res.rows[0].now);
  } catch (err) {
    console.error('❌ Erreur de connexion :', err.message);
  } finally {
    await pool.end();
  }
}

checkConnection();