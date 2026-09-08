const jwt = require('jsonwebtoken');

// Vérification du Token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_emit');
    req.user = decoded; // { id_utilisateur, email, nom_role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide ou expiré.' });
  }
};

// Vérification des Rôles Autorisés
const checkRole = (rolesAutorises) => {
  return (req, res, next) => {
    if (!req.user || !rolesAutorises.includes(req.user.nom_role)) {
      return res.status(403).json({ message: 'Accès non autorisé pour ce rôle.' });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };