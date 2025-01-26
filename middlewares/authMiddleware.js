// Importation des modules nécessaires
const jwt = require('jsonwebtoken'); // Pour décoder et vérifier les tokens JWT
const asyncHandler = require('express-async-handler'); // Pour gérer les erreurs asynchrones
const User = require('../models/User'); // Modèle utilisateur pour récupérer les données

/**
 * Middleware pour protéger les routes et vérifier l'authentification via JWT
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Vérification de l'existence du token dans l'en-tête 'Authorization'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraction du token depuis l'en-tête
      token = req.headers.authorization.split(' ')[1];

      // Vérification et décryptage du token avec la clé secrète
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupération des informations utilisateur sans inclure le mot de passe
      req.user = await User.findById(decoded.id).select('-password');

      // Passage au middleware ou au contrôleur suivant
      next();
    } catch (error) {
      console.error(`Erreur lors de la validation du token : ${error.message}`);
      res.status(401); // Unauthorized
      throw new Error('Accès non autorisé, token invalide');
    }
  } else {
    res.status(401); // Unauthorized
    throw new Error('Accès non autorisé, aucun token fourni');
  }
});

/**
 * Middleware pour vérifier que l'utilisateur a le rôle 'admin'
 */
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // Passe au middleware suivant si le rôle est correct
    } else {
      res.status(403); // Forbidden
      throw new Error('Accès non autorisé, rôle admin requis');
    }
  };
  
module.exports = { protect, admin };
  
