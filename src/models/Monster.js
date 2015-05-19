//Looks familiar I would imagine.
var mongoose = require('mongoose');
var _ = require('underscore');

var MonsterModel;

var setName = function(name){
    return _.escape(name).trim();
};

var MonsterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName
    },
    ac: {
        type: Number,
        min: 10,
        required: true,
        
    },
    hp: {
        type: Number,
        min: 0,
        required: true
    },
    abilityscores: {
        type: Array,
        required: true
    },
    game: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Game' 
    }
});

MonsterSchema.methods.toAPI = function(){

    return {
        name: this.name,
        ac: this.ac,
        hp: this.hp,
        scores: this.scores
    };
};

MonsterSchema.statics.findByGame = function(game, callback){
    var search = {
        game: mongoose.Types.ObjectId(game)
    };
    
    return MonsterModel.find(search).select("name hp ac abilityscores").exec(callback);
};

MonsterModel = mongoose.model('Monster', MonsterSchema);

module.exports.MonsterSchema = MonsterSchema;
module.exports.MonsterModel = MonsterModel;