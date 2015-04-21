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
    hp: {
        type: Number,
        min: 0,
        required: true
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
        hp: this.hp,
        desc: this.description
    };
};

CharSchema.statics.findByOwner = function(ownerId, callback){
    var search = {
        owner: mongoose.Types.ObjectId(ownerId)
    };
    
    return CharModel.find(search).select("name age hp description").exec(callback);
};

CharModel = mongoose.model('Character', CharSchema);

module.exports.CharModel = CharModel;
module.exports.CharSchema = CharSchema;