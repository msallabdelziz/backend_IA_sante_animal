// routes/userRoutes.js

const express = require('express');
const { registerUser, loginUser,getUserProfile, updateUserProfile, getAllUsers ,updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route pour l'inscription (protection avec middleware admin)
router.post('/register', protect, admin, registerUser);

// Route pour la connexion
router.post('/login', loginUser);

// router.post('/create-admin', createInitialAdmin);

// Routes utilisateur (profil personnel)
router.get('/profile', protect, getUserProfile); // Consulter son profil
router.put('/profile', protect, updateUserProfile); // Mettre à jour son profil

// Routes administrateur
router.put('/:id', protect, admin, updateUser); // Mettre à jour un utilisateur
router.delete('/:id', protect, admin, deleteUser); // Supprimer un utilisateur
router.get('/', protect, admin, getAllUsers); // Lister tous les utilisateurs (admin uniquement)


  
// // Route réservée aux admins
// router.get('/admin', protect, admin, async (req, res) => {
// res.json({ message: 'Bienvenue Admin !' });
// });
  

module.exports = router;
