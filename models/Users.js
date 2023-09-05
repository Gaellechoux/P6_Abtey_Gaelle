// Importation du package mongoose
const mongoose = require('mongoose');

// package vérification d'un email unique, deux utilisateurs ne puissent partager la même adresse e-mail.
const uniqueValidator = require('mongoose-unique-validator'); 

const userSchema = mongoose.Schema({ // schema du modèle user demandé
    email: { type: String, required: true, unique: true }, // unique -> une adresse mail = un user
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // utilisation du package
module.exports = mongoose.model('Users', userSchema);