const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);

// Importation optionnelle des routes Admin (si créées par votre binôme)
try {
    const adminRoutes = require('./routes/adminRoutes');
    app.use('/api/admin', adminRoutes);
} catch (error) {
    console.log('Info : routes admin non encore chargées ou chemin différent.');
}

// Route de test de base
app.get('/', (req, res) => {
    res.send('API EMIT - Gestion Scolarité en cours de fonctionnement');
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur :', err.stack);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});