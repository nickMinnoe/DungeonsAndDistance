//depends on files/folders: client, favicon, views

var path = require('path');
var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');
var socketio = require('socket.io');
var csrf = require('csurf');

var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/CharacterMaker";

var db = mongoose.connect(dbURL, function(err){
    if(err){
        console.log("Could not connect to database.");
        throw err;
    }
});

var redisUrl = {
    hostname: 'localhost',
    port: 6379
};

var redisPass;

if(process.env.REDISCLOUD_URL){
    redisUrl = url.parse(process.env.REDISCLOUD_URL);
    redisPass = redisUrl.auth.split(':')[1];
}

var router = require('./router.js');

var server;
var port = process.env.PORT || process.env.NODE_PORT || 3000;

var app = express();
app.use('/assets', express.static(path.resolve(__dirname+'../../client/')));
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    store: new RedisStore({
        host: redisUrl.hostname,
        port: redisUrl.port,
        pass: redisPass
    }),
    secret: 'How you doin',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(favicon(__dirname + '/../client/image/favicon.png'));
app.use(cookieParser());

app.use(csrf());
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
  return;
});

router(app);

server = app.listen(port, function(err){
    if(err){
        throw err;
    }
    console.log('Listening on port '+port);
});

var io = socketio.listen(server);
var users = {};

var onJoined = function(socket) {

	socket.on("join", function(data) {
        socket.name = data.user;
        users[socket.name] = socket.name;
		socket.join('room1');
        
	});
};

var onQue = function(socket){
    socket.on('queue', function(data){
        //drawQue[data.time] = {user:data.user, coords:data.coords};
        io.sockets.in('room1').emit('draw', data);
    });
};

var onDisconnect = function(socket) {

	socket.on("disconnect", function(data) {

		socket.leave('room1');
        delete users[socket.name];
        io.sockets.in('room1').emit('remove', {user: socket.name});
	});
};

console.log('starting up sockets');

io.sockets.on("connection", function(socket) {

    onJoined(socket);
    onQue(socket); 
    onDisconnect(socket);
	
});