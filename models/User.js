const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true }, // Prénom
    lastName: { type: String, required: true },  // Nom
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true }, // Téléphone
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'eleveur'], default: 'eleveur' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
