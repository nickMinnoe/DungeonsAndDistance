var _ = require('underscore');
var models = require('../models');

var Char = models.Character;

var creationPage = function(req, res){
    Char.CharModel.findByOwner(req.session.account._id, function(err, docs){
        if(err){
            console.log(err);
            return res.status(400).json({error:'An error occurred'});
        }
        console.log(docs);
        res.render('creation', {chars: docs});
    });
};

var createChar = function(req, res){
    if(!req.body.name || !req.body.age){
        return res.status(400).json({error: "All fields are required"});
    }
    
    var charData = {
        name: req.body.name,
        age: req.body.age,
        hp: req.body.HP,
        description: req.body.desc,
        owner: req.session.account._id
    };
    
    var newChar = new Char.CharModel(charData);
    
    newChar.save(function(err){
        if(err){
            console.log(err);
            return res.status(400).json({error:"An error occurred"});
        }
        res.json({redirect: '/creater'});
    });
};

module.exports.creationPage = creationPage;
module.exports.create = createChar;