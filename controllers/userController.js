// controllers/userControllers

const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Contrôleur pour l'inscription
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, password, role } = req.body;

   // Vérifier que l'utilisateur connecté est un admin
   if (!req.user || req.user.role !== 'admin') {
    res.status(403); // Forbidden
    throw new Error('Accès refusé : seul un admin peut créer des utilisateurs.');
    }

    if (!firstName || !lastName || !email || !phone || !password) {
        res.status(400);
        throw new Error('Veuillez fournir tous les champs requis');
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('Cet utilisateur existe déjà.');
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
        res.status(400);
        throw new Error('Ce numéro de téléphone existe déjà.');
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Assigner un rôle
    let userRole = 'elevateur'; // Rôle par défaut
    if (role && role === 'admin') {
        userRole = 'admin'; // Autoriser le rôle admin si fourni
    }

    // Créer l'utilisateur
    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role: userRole,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Échec de l'inscription.");
    }
});

  

// Connexion d'un utilisateur
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }
  
    // Rechercher l'utilisateur par email
    const user = await User.findOne({ email });
  
    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id), // Générer un token JWT
      });
    } else {
      res.status(401); // Unauthorized
      throw new Error('Invalid email or password');
    }
  });
  
  // Générer un Token JWT
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d', // Token valide pendant 30 jours
    });
  };
  

// const createInitialAdmin = asyncHandler(async (req, res) => {
//   const adminExists = await User.findOne({ role: 'admin' });
//   if (adminExists) {
//       res.status(400);
//       throw new Error('Admin already exists');
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash('admin123', salt); // Mot de passe par défaut

//   const admin = await User.create({
//       firstName: 'Super',
//       lastName: 'Admin',
//       email: 'admin@example.com',
//       phone: '0758378844',
//       password: hashedPassword,
//       role: 'admin',
//   });

//   if (admin) {
//       res.status(201).json({
//           _id: admin.id,
//           firstName: admin.firstName,
//           lastName: admin.lastName,
//           email: admin.email,
//           phone: admin.phone,
//           role: admin.role,
//       });
//   } else {
//       res.status(400);
//       throw new Error("Failed to create admin");
//   }
// });


module.exports = {registerUser, loginUser };
