var models = require('../models');

var Game = models.Game;
var Char = models.Character;
var Mon = models.Monster;

var gamePage = function(req, res){
    Game.GameModel.findByName("wagv", function(err, game){
        if(err){
            console.log(err);
            return res.status(400).json({error:'An error occurred'});
        }
        if(req.session.account._id == game[0].dm){
            Mon.MonsterModel.findByGame(game[0]._id, function(err, monsters){
                if(err){
                    return res.status(400).json({error:"Error finding monsters!"});
                }
                res.render('game', {user: req.session.account._id, mons: monsters, game: game[0]});
            });
        } else{
            Char.CharModel.findByOwner(req.session.account._id, function(err, docs){
                if(err){
                    console.log(err);
                    return res.status(400).json({error:'An error occurred'});
                }
                res.render('gamePlayer', {user: req.session.account._id, chars: docs, game: game[0]});
            });
        }
        
    });
};

var createGame = function(req, res){
    if(!req.body.name){
        return res.status(400).json({error: "Need to give it a name."});
    }
    
    var gameData = {
        name: req.body.name,
        dm: req.session.account._id,
        monsters: []
    };
    
    var newGame = new Game.GameModel(gameData);
    
    newGame.save(function(err){
        if(err){
            console.log(err);
            return res.status(400).json({error:"An error occurred"});
        }
        res.json({redirect: '/game'});
    });
};

module.exports.gamePage = gamePage;
module.exports.create = createGame;