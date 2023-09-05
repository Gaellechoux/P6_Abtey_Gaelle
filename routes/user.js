// Exportation du Router dans express
const express = require('express');
const router = express.Router();
const password = require('../models/password-validator');

// on crée le chemin user dans le controllers 
const userCtrl = require('../controllers/user');

// les routes post car le frontend va envoyer des informations tel que l'adresse mail et le mot de passe
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation du Router
module.exports = router;