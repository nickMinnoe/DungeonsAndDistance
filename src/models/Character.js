var mongoose = require('mongoose');
var _ = require('underscore');

var CharacterModel;

var setName = function(name){
    return _.escape(name).trim();
};

var CharSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName
    },
    age: {
        type: Number,
        min: 0,
        required: true
    },
    level: {
        type: Number,
        min: 1,
        required: true
    },
    hp: {
        type: Number,
        min: 0,
        required: true
    },
    ac: {
        type: Number,
        min: 10,
        required: true
    },
    abilityScores: {
        type: Array,
        required: true
    },
    inventory: {
        type: String,
        required: false,
        trim: false
    },
    description: {
        type: String,
        required: false,
        trim: false
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account'
    }
    
});

CharSchema.methods.toAPI = function(){
    return {
        name: this.name,
        age: this.age,
        level: this.level,
        hp: this.hp,
        ac: this.ac,
        scores: this.abilityScores,
        inventory: this.inventory,
        desc: this.description
    };
};

CharSchema.statics.findByOwner = function(ownerId, callback){
    var search = {
        owner: mongoose.Types.ObjectId(ownerId)
    };
    
    return CharModel.find(search).select("name age level hp ac abilityScores inventory description").exec(callback);
};

CharModel = mongoose.model('Character', CharSchema);

module.exports.CharModel = CharModel;
module.exports.CharSchema = CharSchema;