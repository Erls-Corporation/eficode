var gamejs = require('gamejs'),
	  tick = require('tick'),
	  ipad = require('ipad');

$(document).ready(function() {
	var socket = io.connect();

	var scaleToFitWindow = function() {
	  var areaWidth = $(window).width() - $('#sidebar').width() - 20
      , areaHeight = $(window).height() - $('#header').height() - 20
      , resizeFactor = Math.min(areaWidth / window.params.gameWidth, areaHeight / window.params.gameHeight);
    
    $("#gjs-canvas").css({
      width: window.params.gameWidth * resizeFactor,
      height: window.params.gameHeight * resizeFactor
    });
	};


	var main = function() {
		$("#login").remove();
		$("#main").show();
		
		display = gamejs.display.setMode([window.params.gameWidth, window.params.gameHeight]);    
		scaleToFitWindow();
		
		tick.start(display, socket);
		ipad.start(socket);
	};

  function start() {
      socket.emit('join', $('#nick').val(), function(ok) {
        if (ok) {
          gamejs.preload(
              ["images/panda_side_1.png", "images/panda_side_2.png",
               "images/panda_down_1.png", "images/panda_down_2.png",
               "images/panda_up_1.png", "images/panda_up_2.png",
               "images/panda_sitting_down.png",
               "images/panda_sitting_up.png",
               "images/panda_sitting_right.png",
               "images/flame_bolt_vert_1.png", "images/flame_bolt_vert_2.png",
               "images/grass_tile.png",
               "images/flame_bolt_horizontal_1.png", "images/flame_bolt_horizontal_2.png",
               "images/blood_splash.png", "images/palm.png",
               "images/dead_panda.png",
               "images/sand.png"
              ]);
          
          gamejs.ready(main);
        } else {
          $("#login-fail").show();
        }
      });
  };

  $('#start').click(start);
  
  $('#nick').keyup(function(event) {
    if(event.keyCode == 13) {
        start();
    };
  });
});
