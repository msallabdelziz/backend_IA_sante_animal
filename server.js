const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();

// Middleware pour traiter les données JSON
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Importer les routes utilisateur
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Les routes des fermes.
const farmRoutes = require('./routes/farmRoutes');
app.use('/api/farms', farmRoutes);


// Définir le port
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

