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
  

// Consulter son profil
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
      res.status(404);
      throw new Error('Utilisateur introuvable.');
  }

  res.status(200).json(user);
});

// Lister tous les utilisateurs (Admin uniquement)
const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403); // Forbidden
    throw new Error('Accès refusé : seul un administrateur peut voir tous les utilisateurs');
  }

  const users = await User.find({}).select('-password'); // Ne pas inclure les mots de passe
  res.status(200).json(users);
});


// Mettre à jour son profil (Mot de passe & Numéro de téléphone uniquement)
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('Utilisateur introuvable.');
  }

  const { phone, password } = req.body;

  // Mettre à jour le numéro de téléphone
  if (phone) {
    const phoneExists = await User.findOne({ phone });
    if (phoneExists && phoneExists._id.toString() !== req.user._id.toString()) {
      res.status(400);
      throw new Error('Ce numéro de téléphone est déjà utilisé.');
    }
    user.phone = phone; // Mise à jour du téléphone
  }

  // Mettre à jour le mot de passe
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt); // Hachage et mise à jour du mot de passe
  }

  // Enregistrer les modifications
  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser.id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
  });
});


// Mettre à jour un utilisateur (Par Admin uniquement)
const updateUser = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
      res.status(403); // Forbidden
      throw new Error('Accès refusé : seul un admin peut mettre à jour un utilisateur.');
  }

  // const { id } = req.params;

  //   // Vérifiez si l'ID est valide
  //   if (!mongoose.Types.ObjectId.isValid(id)) {
  //       res.status(400);
  //       throw new Error('ID utilisateur invalide');
  //   }


  const { firstName, lastName, email, phone, role, password } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
      res.status(404);
      throw new Error('Utilisateur introuvable.');
  }

  // Mise à jour des champs
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.role = role || user.role;

  if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await user.save();

  res.status(200).json({
      _id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
  });
});

// Supprimer un utilisateur (Admin uniquement)
const deleteUser = asyncHandler(async (req, res) => {
  // Vérifier si l'utilisateur connecté est un admin
  if (!req.user || req.user.role !== 'admin') {
      res.status(403); // Forbidden
      throw new Error('Accès refusé : seul un admin peut supprimer un utilisateur.');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
      res.status(404);
      throw new Error('Utilisateur introuvable.');
  }

  // Utiliser findByIdAndDelete pour supprimer directement l'utilisateur
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
});

// Export des fonctions

module.exports = {registerUser, loginUser, getUserProfile, getAllUsers, updateUserProfile, updateUser,deleteUser };