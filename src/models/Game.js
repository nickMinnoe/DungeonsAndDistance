var mongoose = require('mongoose');

var GameModel;

var GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dm: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account'
    },
});

GameSchema.statics.findByName = function(name, callback){
    var search = {
        name: name
    };
    
    return GameModel.find(search).select("name dm").exec(callback);
};

GameModel = mongoose.model('Game', GameSchema);

module.exports.GameSchema = GameSchema;
module.exports.GameModel = GameModel;