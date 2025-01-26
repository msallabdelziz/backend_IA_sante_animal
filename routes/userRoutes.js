const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

// Routes utilisateurs
router.post('/register', registerUser);
router.post('/login', loginUser);

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
