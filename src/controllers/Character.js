var _ = require('underscore');
var models = require('../models');

var Char = models.Character;
//The basic creation page, based on Domo Maker
var creationPage = function(req, res){
    Char.CharModel.findByOwner(req.session.account._id, function(err, docs){
        if(err){
            console.log(err);
            return res.status(400).json({error:'An error occurred'});
        }
        console.log("DOCS",docs);
        res.render('creation', {chars: docs, csrfToken: req.csrfToken()});
    });
};
//Creation function, actually make your domo.
var createChar = function(req, res){
    if(!req.body.name || !req.body.age || !req.body.level || !req.body.HP || !req.body.AC || !req.body.str || !req.body.dex || !req.body.con || !req.body.intel || !req.body.wis || !req.body.cha  || !req.body.inventory || !req.body.desc){
        return res.status(400).json({error: "All fields are required"});
    }
    
    var charData = {
        name: req.body.name,
        age: req.body.age,
        level: req.body.level,
        hp: req.body.HP,
        ac: req.body.AC,
        abilityScores: [
            req.body.str,
            req.body.dex,
            req.body.con,
            req.body.intel,
            req.body.wis,
            req.body.cha
        ],
        inventory: req.body.inventory,
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