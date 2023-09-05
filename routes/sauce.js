// Importation des fichiers et package
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// on crée le chemin sauce dans le controllers 
const sauceCtrl = require('../controllers/sauce');
// gestionnaires de routes avec l'authentification auth 
// Chaque route à ça requête (post, get, put, delete)
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

// exportation du Router
module.exports = router;