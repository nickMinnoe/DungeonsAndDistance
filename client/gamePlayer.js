"use strict";
//Dat dur' lone global.
var socket;
window.onload = function(){
    console.log("User", user);
    //Get all of the characters and put them as options
    $.each(chars, function (i, item) {
    $('#charSelect').append($('<option>', { 
        value: item._id,
        text : item.name 
    }));
    });
    //Arrow key link up
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
    
    var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext('2d');
    var draws={monster: {}};
    
	socket = io.connect();


	socket.on('connect', function() {
		console.log('connecting');

		socket.emit('join', {user: user});
	});		
 
    //Receive message from server about updates
    socket.on('draw', function(data){
        console.log(data);
        //Save the monsters in their own list as apart of draws.
        if(data.user === 'monster'){
            draws[data.user][data.monsterName] = {coords: data.coords};
        } else if(!draws[data.user]){
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
                    
                    ctx.fillStyle="#FF0000";
                    
                    ctx.fillRect(drawCall.coords.x, drawCall.coords.y, drawCall.coords.width, drawCall.coords.height);
                }
            } else{
        
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
    //Update the users object and updatedTime works with arrow keys
    var moveRight = function(){
        var time = new Date().getTime();
        draws[user].coords.lastUpdate = time;
        draws[user].coords.x += 50;
        socket.emit('queue', {user: user, coords:draws[user].coords});
    };
    var moveLeft = function(){
        var time = new Date().getTime();
        draws[user].coords.lastUpdate = time;
        draws[user].coords.x -= 50;
        socket.emit('queue', {user: user, coords:draws[user].coords});
    };
    var moveUp = function(){
        var time = new Date().getTime();
        draws[user].coords.lastUpdate = time;
        draws[user].coords.y -= 50;
        socket.emit('queue', {user: user, coords:draws[user].coords});
    };
    var moveDown = function(){
        var time = new Date().getTime();
        draws[user].coords.lastUpdate = time;
        draws[user].coords.y += 50;
        socket.emit('queue', {user: user, coords:draws[user].coords});
    };
            
    socket.on('remove', function(data){delete draws[data.user];});

};
//Fill in that there character info
var selectedChar = function(){
    var chosen = findById(chars, $('charSelect').val());
    console.log("CHOSEN", chosen);
    var innerHTML = "<div class=name>"+chosen.name+"</div>"
    innerHTML += "<div class=hp>"+chosen.hp+" years old</div>"
    innerHTML += "<div class=level>lvl:"+chosen.level+"</div>"
    innerHTML += "<div class=hp>HP:"+chosen.hp+"</div>"
    innerHTML += "<div class=ac>AC:"+chosen.ac+"</div>"
    
    
    innerHTML += "<div class=scoreLabel>Str:</div>";
    innerHTML += "<div class=score>"+chosen.abilityScores[0]+"</div><br>";
    innerHTML += "<div class=scoreLabel>Dex:</div>";
    innerHTML += "<div class=score>"+chosen.abilityScores[1]+"</div><br>";
    innerHTML += "<div class=scoreLabel>Con:</div>";
    innerHTML += "<div class=score>"+chosen.abilityScores[2]+"</div><br>";
    innerHTML += "<div class=scoreLabel>Int:</div>";
    innerHTML += "<div class=score>"+chosen.abilityScores[3]+"</div><br>";
    innerHTML += "<div class=scoreLabel>Wis:</div>";
    innerHTML += "<div class=score>"+chosen.abilityScores[4]+"</div><br>";
    innerHTML += "<div class=scoreLabel>Cha:</div>";
    innerHTML += "<div class=score>"+chosen.abilityScores[5]+"</div><br>";

    
    innerHTML += "<div class=inventory>Inventry<br>"+chosen.inventory+"</div>"
    innerHTML += "<div class=description>Everything else: <br>"+chosen.description+"</div>"
    
    $('#charSelect').remove();
    $('#charInfo').css({'display':'block'});
    $('#charInfo').append(innerHTML);
    
    setup();

};

//initialize user's object
function setup(){
    var time = new Date().getTime()
    var x = Math.floor(Math.random()*10)*50;
    var y = Math.floor(Math.random()*6)*50;
    socket.emit('queue', {user:user, coords:{lastUpdate: time, x:x, y:y, width:50, height:50}});
}

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