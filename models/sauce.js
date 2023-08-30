const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({ // schema du modèle de sauce demandé

    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String }, 
    mainPepper: { type: String, required: true },
    heat: { type: Number }, 
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0 },
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]},
});
module.exports = mongoose.model('Sauce', sauceSchema); 
// exportation du model dans la base de donnée