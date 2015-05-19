//depends on folders controllers and middleware
var controllers = require('./controllers');
var mid = require('./middleware');

var router = function(app){
    app.get("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post("/login", mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.get("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
    app.post("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get("/logout", mid.requiresLogin, controllers.Account.logout);
    app.get("/creater", mid.requiresLogin, controllers.Character.creationPage);
    app.post("/creater", mid.requiresLogin, controllers.Character.create);
    app.get("/", mid.requiresSecure, controllers.Account.loginPage);
    app.get("/game", mid.requiresLogin, controllers.Game.gamePage);
    app.post("/game", mid.requiresLogin, controllers.Game.create);
    app.post("/makeMon", mid.requiresLogin, controllers.Monster.create);
};

module.exports = router;