const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Contrôleur pour l'inscription
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
  
    if (!firstName || !lastName || !email || !phone || !password) {
      res.status(400);
      throw new Error('Please provide all fields');
    }
  
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
  
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      res.status(400);
      throw new Error('Phone number already exists');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({ firstName, lastName, email, phone, password: hashedPassword });
    if (user) {
      res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
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
  

module.exports = { registerUser, loginUser };
