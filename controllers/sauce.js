const { log } = require('console');
const Sauce = require('../models/sauce');
const fs = require('fs');

// Exportation de la fonction createSauce
// créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  console.log(sauceObject);
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  

  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
  
};
// Affichage de toutes les sauce 
  exports.getAllSauces =  (req, res, next) => {
    // pour l'affichage de toutes les sauce on utilise find()
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
    }

    // pour l'affichage d'une sauce 
    exports.getOneSauce = (req, res, next) => {

   // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
        Sauce.findOne({ _id: req.params.id })
          .then(sauce => res.status(200).json(sauce))
          .catch(error => res.status(404).json({ error }));
      }

    //   Suppression d'une saute 
     exports.deleteSauce = (req, res, next) => {
        Sauce.findOne({ _id: req.params.id})
          .then(sauce => {
              if (sauce.userId != req.auth.userId) {
                  res.status(401).json({message: 'Non-autorisé'});
              } else {
                  const filename = sauce.imageUrl.split('/images/')[1];
                  fs.unlink(`images/${filename}`, () => {
                      sauce.deleteOne({_id: req.params.id})
                          .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                          .catch(error => res.status(401).json({ error }));
                  });
              }
          })
          .catch( error => {
              res.status(500).json({ error });
          });
     }

     exports.modifySauce = (req, res, next) => {
        // mettre à jours les données
        const sauceObject = req.file ? { 
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    
      delete sauceObject._userId;
      Sauce.findOne({_id: req.params.id})
          .then((sauce) => {
              if (sauce.userId != req.auth.userId) {
                  res.status(401).json({ message : 'Non autorisé'});
              } else {
                  Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                  .then(() => res.status(200).json({message : 'Sauce enregistrée!'}))
                  .catch(error => res.status(401).json({ error }));
              }
          })
          .catch((error) => {
              res.status(400).json({ error });
          });
      }


exports.likeSauce = (req, res, next) => {

    const like = req.body.like;

        if(like === 1) {
            console.log(like);
         Sauce.updateOne(
            { _id: req.params.id},
            
             {  
                $inc: { likes: 1},
                $set : {usersLiked: req.body.userId},
                _id: req.params.id   
             
             }
         )
         .then(() => res.status(200).json({message : 'Tu aimes cette sauce!'}))
         .catch(error => res.status(400).json({ error }));
        }  

       else if(like === -1) {
            console.log(like);
         Sauce.updateOne( 
            { _id: req.params.id},  
            
             {    
                $inc: { dislikes: 1},
                $set: {usersDisliked: req.body.userId}, 
                _id: req.params.id 
             
             }
         )
         .then(() => res.status(200).json({message : 'Tu aimes pas cette sauce!'}))
         .catch(error => res.status(400).json({ error }));
        }

        else {    // annulation du bouton j'aime et je n'aime pas
            Sauce.findOne( {_id: req.params.id})
            .then( sauce => {
                if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                     Sauce.updateOne({_id: req.params.id}, 
                        { 
                        $inc: { likes: -1},
                        $pull: { usersLiked: req.body.userId}, 
                        _id: req.params.id })
                    .then( () => res.status(200).json({ message: 'Tu n\'aimes plus cette sauce ' }))
                    .catch( error => res.status(400).json({ error}))
                    }
    
                else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                    Sauce.updateOne( {_id: req.params.id}, 
                    { 
                    $inc: { dislikes: -1 }, 
                    $pull: { usersDisliked: req.body.userId}, 
                    _id: req.params.id
                }
                )
                    .then( () => res.status(200).json({ message: 'Tu peux aimer cette sauce!' }))
                    .catch( error => res.status(400).json({ error}))
                    }           
            })
            .catch( error => res.status(400).json({ error}))             
        }   
      
      }

             
            
    

  