// Recupération des packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose'); 
const path = require('path');
dotenv.config();

// Importation des Routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Conncetion avec mongoose
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.wt4muno.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
// Le server dans lequel va fonctionner l'api
const app = express();

// CORS - partage de ressources entre serveurs
  app.use(cors());

  app.use(express.json());
  // La gestion des chemin de API
  app.use('/api/auth', userRoutes);
  app.use('/api/sauces', sauceRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images'))); 

  // Export de l'application
module.exports = app;