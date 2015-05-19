var models = require('../models');

var Mon = models.Monster;

var createMon = function(req, res){
    if(!req.body.name || !req.body.HP || !req.body.AC){
        return res.status(400).json({error: "Name, HP and AC fields are required"});
    }
    var scores = [0,0,0,0,0,0];
    if(req.body.str){
        scores[0] = req.body.str;
    } if(req.body.dex){
        scores[1] = req.body.dex;
    } if(req.body.con){
        scores[2] = req.body.con;
    } if(req.body.intel){
        scores[3] = req.body.intel;
    } if(req.body.wis){
        scores[4] = req.body.wis;
    }if(req.body.cha){
        scores[5] = req.body.cha;
    }
    var monData = {
        name: req.body.name,
        hp: req.body.HP,
        ac: req.body.AC,
        abilityscores: scores,
        game: req.body.game
    };
    
    var newMon = new Mon.MonsterModel(monData);
    
    newMon.save(function(err){
        if(err){
            console.log(err);
            return res.status(400).json({error:"An error occurred"});
        }
        res.json({redirect: '/game'});
    });
};

module.exports.create = createMon;