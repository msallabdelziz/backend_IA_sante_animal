// models/Farm.js

const mongoose = require('mongoose');

const farmSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Nom de la ferme
    location: { type: String, required: true }, // Localisation de la ferme
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Propriétaire de la ferme
    categories: [
      {
        name: { type: String, required: true }, // Nom de la catégorie (ex : volailles, bovins, etc.)
        species: [{ type: String }], // Espèces animales dans cette catégorie
      },
    ],
  },
  { timestamps: true } // Date de création et de mise à jour
);

module.exports = mongoose.model('Farm', farmSchema);