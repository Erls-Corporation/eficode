var gamejs = require('gamejs'),
	tick = require('tick');

$(document).ready(function() {
	var socket = io.connect();
	
	var main = function() {
		$("#login").hide();
		$("#main").show();

		display = gamejs.display.setMode([600, 600]);
		tick.start(display, socket);
	};
	
	$('#start').click(function() {
    socket.emit('join', $('#nick').val(), function() {
      gamejs.preload(
				["images/panda_side_1.png", "images/panda_side_2.png",
				 "images/panda_down_1.png", "images/panda_down_2.png",
				 "images/panda_up_1.png", "images/panda_up_2.png",
				 "images/panda_sitting.png",
				 "images/flame_bolt_vert_1.png", "images/flame_bolt_vert_2.png",
				 "images/grass_tile.png"
				]);
			
			gamejs.ready(main);
    });
  });
});