var gamejs = require('gamejs'),
	sprites = require('sprites');

var start = function(display, socket) {
	var currentDirection = 0;
	var allAnimals = {};
	var projectiles = new gamejs.sprite.Group();
	var explosions = new gamejs.sprite.Group();
	
	var getDirectionValue = function(key) {
		switch (key) {
			case gamejs.event.K_UP:
				return 1;
				break;
				
			case gamejs.event.K_DOWN:
				return 2;
				break;
				
			case gamejs.event.K_LEFT:
				return 3;
				break;
				
			case gamejs.event.K_RIGHT:
				return 4;
				break;
				
			default:
				return -1;
		}
	};
	
	var handleKeyDown = function(key) {
		if (key == gamejs.event.K_SPACE) {
			socket.emit('fire', function() {
				// do nothing
			});	
		} else {
			var direction = getDirectionValue(key);
		
			if (direction !== -1 && currentDirection !== direction) {
				currentDirection = direction;
			
				socket.emit('startMoving', direction, function() {
					// do nothing
				});
			}
		}
	};
	
	var handleKeyUp = function(key) {
		if (getDirectionValue(key) === currentDirection) {
			socket.emit('stopMoving', function() {
				currentDirection = -1;
			});
		}
	};
	
	var createAnimal = function(player) {
		if (player.type == "PANDA") {
			return new sprites.Panda();
		} else {
			return null;
		}
	};
	
	var handlePanda = function(pandaState) {
		$('#player-list').append($('<li>').text(pandaState.nick));
		
		var panda = allAnimals[pandaState.nick];	
		if (panda === undefined) {
			panda = allAnimals[pandaState.nick] = createAnimal(pandaState);
		}
		
		panda.updateState(pandaState.x, pandaState.y, pandaState.dir, pandaState.moving);
	};
	
	var handleProjectile = function(projectileState) {
		var proj = new sprites.Projectile();
		proj.updateState(projectileState.x, projectileState.y, projectileState.dir, projectileState.moving);
		
		projectiles.add(proj);
	};
	
	var handleExplosion = function(explosionState) {
		explosions.add(new sprites.Bloodsplash([explosionState.x, explosionState.y]));
	};
	
	socket.on('gameState', function(state) {
		projectiles = new gamejs.sprite.Group();
		explosions  = new gamejs.sprite.Group();
		
    $('#player-list').empty();
		var allPandasInState = {};
		
		_(state.pandas).each(function(panda) {
			handlePanda(panda);
			allPandasInState[panda.nick] = true;
		});
  	_(state.projs).each(function(proj) {
  		handleProjectile(proj);
  	});
    _(state.expl).each(function(expl) {
      handleExplosion(expl);
    });  

		_(allAnimals).each(function(animals, nick) {
			if (allPandasInState[nick] === undefined) {
				delete allAnimals[nick];
			}
		});
  });

	var grass = new gamejs.sprite.Group();
	var i, j;
	for (i = 0; i < 600; i += 15) {
		for (j = 0; j < 600; j += 15) {
			grass.add(new sprites.Grass([i, j]));
		}
	}
	
	var tick = function(msDuration) {
		var mainSurface = gamejs.display.getSurface();
		mainSurface.fill("#FFFFFF");
		
		grass.draw(mainSurface);
		projectiles.update(msDuration);
		projectiles.draw(mainSurface);
		
		gamejs.event.get().forEach(function(e) {
			if (e.type == gamejs.event.KEY_DOWN) {
				handleKeyDown(e.key);
			} else if (e.type == gamejs.event.KEY_UP) {
				handleKeyUp(e.key);
			}
		});
		
		_(allAnimals).each(function(animal, animalId) {
			animal.update(msDuration);
			animal.draw(mainSurface);
		});
		
		
		explosions.draw(mainSurface);
	};
	
	gamejs.time.fpsCallback(tick, this, 15);
};

exports.start = start;
