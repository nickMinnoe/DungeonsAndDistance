"use strict";
//Some globals because we all love the globals.
var socket;
var monCounter=0;
var monSelector=0;
//Wait for that badboy to load.
window.onload = function(){ 
 var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext('2d');
    var draws={monster: {}};
    
	socket = io.connect();

//Send the use to keep track of in the game.
	socket.on('connect', function() {
		console.log('connecting');

		socket.emit('join', {user: user});
	});		
    //Links up up button presses with movement code
    $(document).keydown(function(e){
        if (e.keyCode == 37) { 
            moveLeft();
        }else if (e.keyCode == 38) { 
            moveUp();
        }else if (e.keyCode == 39) { 
            moveRight();
        }else if (e.keyCode == 40) { 
            moveDown();
        }
    });

    //Receive message from server about updates
    socket.on('draw', function(data){
        console.log(data);
        //Save the monsters in their own list as apart of draws.
        if(data.user === 'monster'){
            draws[data.user][data.monsterName] = {coords: data.coords};
        }else if(!draws[data.user]){
            draws[data.user] = {coords: data.coords};
        } else if(data.coords.lastUpdate > draws[user].coords.lastUpdate){
            draws[data.user] = {coords: data.coords};
        }
        draw();
    });
    //Draw all users on the canvas
    function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
        var keys = Object.keys(draws);
        for(var i=0; i<keys.length;i++){
        
            //handles monster list since it is different than players
            if(keys[i] === 'monster'){
                var keys2 = Object.keys(draws['monster']);
                for(var i=0; i<keys2.length;i++){
                
                    var drawCall = draws['monster'][keys2[i]];
                    console.log(drawCall);
                    ctx.fillStyle="#FF0000";
                    
                    ctx.fillRect(drawCall.coords.x, drawCall.coords.y, drawCall.coords.width, drawCall.coords.height);
                }
            }
            else{
                var drawCall = draws[keys[i]];
                
                if(keys[i] == user){
                    ctx.globalAlpha = 1;
                } else{
                    ctx.globalAlpha = 0.5;
                }
                
                ctx.fillRect(drawCall.coords.x, drawCall.coords.y, drawCall.coords.width, drawCall.coords.height);
            }
        }
    }
    //Update the users object and updatedTime, "works" with
    //arrow keys for movement
    //For some reason this breaks at draws['monster'][monSelector].coords
    //I tried using a hardcoded int or string, neither work... all of
    //these will work in a console.log however, so I wasn't sure where
    //to go from there.. If this worked it would have been a simple way
    //to move any of the monsters.
    
    
    //https://www.youtube.com/watch?v=XRvpGGc9Jv8
    //But actually crying.
    //So many tears.
    //Dead.
    var moveRight = function(){
        var time = new Date().getTime();
        console.log(draws['monster'][monSelector]);
        draws['monster'][monSelector].coords.lastUpdate = time;
        draws['monster'][monSelector].coords.x += 50;
        socket.emit('queue', {user: user, monsterName: monSelector.toString(), coords:draws[user].coords});
    };
    var moveLeft = function(){
        var time = new Date().getTime();
        draws['monster'][monSelector].coords.lastUpdate = time;
        draws['monster'][monSelector].coords.x -= 50;
        socket.emit('queue', {user: user, monsterName: monSelector.toString(), coords:draws[user].coords});
    };
    var moveUp = function(){
        var time = new Date().getTime();
        draws['monster'][monSelector].coords.lastUpdate = time;
        draws['monster'][monSelector].coords.y -= 50;
        socket.emit('queue', {user: user, monsterName: monSelector.toString(), coords:draws[user].coords});
    };
    var moveDown = function(){
        var time = new Date().getTime();
        draws['monster'][monSelector].coords.lastUpdate = time;
        draws['monster'][monSelector].coords.y += 50;
        socket.emit('queue', {user: user, monsterName: monSelector.toString(), coords:draws[user].coords});
    };
    //remove someone who moves.
    socket.on('remove', function(data){delete draws[data.user];});
    
};

//This cute little function can be found here.
//http://stackoverflow.com/questions/7364150/find-object-by-id-in-array-of-javascript-objects
//It certainly helped me in my sleep deprieved nights.
function findById(source, id) {
  for (var i = 0; i < source.length; i++) {
    if (source[i].id === id) {
      return source[i];
    }
  }
}
//Set those monsters free.
function summon(monster){
        var time = new Date().getTime()
        var x = Math.floor(Math.random()*10)*50;
        var y = Math.floor(Math.random()*6)*50;
        
        monCounter += 1;
        monSelector = monCounter;
        socket.emit('queue', {user:'monster', monsterName: monCounter.toString(), coords:{lastUpdate: time, x:x, y:y, width:50, height:50}});
    }
function updateNum(){
   monSelector = parseInt($('#monNum').val());
}