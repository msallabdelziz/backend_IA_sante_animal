const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route pour l'inscription (protection avec middleware admin)
router.post('/register', protect, admin, registerUser);

// Route pour la connexion
router.post('/login', loginUser);

// router.post('/create-admin', createInitialAdmin);

// // Route protégée pour l'accès au profil utilisateur
// router.get('/profile', protect, async (req, res) => {
//     res.json({
//       message: `Bienvenue ${req.user.firstName}!`,
//       user: req.user,
//     });
//   });
  
// // Route réservée aux admins
// router.get('/admin', protect, admin, async (req, res) => {
// res.json({ message: 'Bienvenue Admin !' });
// });
  

module.exports = router;
