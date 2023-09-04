//Importation du package bcrypt qu'in installe
const bcrypt = require('bcrypt');
// Package permettant de créer des token et de les vérifiés
const jwt = require('jsonwebtoken'); 

// Models User importer 
const Users = require('../models/Users');

// Enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
  console.log(req.body);
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new Users({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error =>{ 
            console.log(error);
             res.status(400).json({ error })
             });
      })
      .catch(error => res.status(500).json({ error }));
  };

  // La connextion des utilisateurs existant
  exports.login = (req, res, next) => {
    Users.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'process.env.TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };