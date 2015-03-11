(function() {
	$(document).ready(function() {
		var game = {};
		game.stars = [];
		game.width = 550;
		game.height = 600;
		game.x = 0;
		game.y = 0;
		game.keys = [];
		game.images = [];
		game.doneImages = 0;
		game.requiredImages = 0;

		game.count = 24;
		game.division = 48;
		game.left = false;
		game.enemySpeed = 2;

		game.fullShootTimer = 10;
		game.shootTimer = game.fullShootTimer;

		game.player = {
			x: game.width / 2 - 50,
			y: game.height - 110,
			width: 100,
			height: 100,
			speed: 3,
			rendered: false
		};

		game.projectiles = [];

		game.enemies = [];
		game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");
		game.contextPlayer = document.getElementById("playerCanvas").getContext("2d");
		game.contextEnemies = document.getElementById("enemiesCanvas").getContext("2d");

		/*
		 * up : 38, down: 40, left : 37, right: 39
		 * space: 32
		 * w: 87, a: 65, s: 83, d: 68
		 **/
		$(document).keydown(function(e) {
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
		});

		$(document).keyup(function(e) {
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});

		function addBullet() {
			game.projectiles.push({
				x: game.player.x,
				y: game.player.y,
				size: 20,
				image: 2
			});
		}

		function init() {
			// fill background with stars initially.
			for (var i = 0; i < 600; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * game.width),
					y: Math.floor(Math.random() * game.height),
					size: Math.random() * 5
				});
			}

			for (var y = 0; y < 5; y++) {
				for (var x = 0; x < 5; x++) {
					game.enemies.push({
						x: x * 80 + 80,
						y: y * 80 + 40,
						width: 70,
						height: 70,
						image: 1
					});
				}
			}
			loop();
		}

		function addStars(num) {
			for (var i = 0; i < num; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * game.width),
					y: game.height + 10,
					size: Math.random() * 5
				});
			}
		}

		function update() {
			addStars(1);
			game.count++;
			if (game.shootTimer > 0) game.shootTimer--;

			for (i in game.stars) {
				if (game.stars.y <= -5) {
					game.stars.splice(i, 1);
				}
				game.stars[i].y--;
			}
			//left
			if (game.keys[37] || game.keys[65]) {
				if (game.player.x >= 0) {
					game.player.x -= game.player.speed;
					game.player.rendered = false;
				}
			}
			//right
			if (game.keys[39] || game.keys[68]) {
				if (game.player.x <= game.width - game.player.width) {
					game.player.x += game.player.speed;
					game.player.rendered = false;
				}
			}

			if (game.count % game.division == 0) {
				game.left = !game.left;
			}

			for (var i in game.enemies) {
				if (game.left) {
					game.enemies[i].x -= game.enemySpeed;
				} else {
					game.enemies[i].x += game.enemySpeed;
				}
			}

			for (var i in game.projectiles) {
				game.projectiles[i].y -= 3;
				if (game.projectiles[i].y <= -(game.projectiles[i].size)) {
					game.projectiles.splice(i, 1);
				}
			}

			if (game.keys[32] && game.shootTimer <= 0) {
				addBullet();
				game.shootTimer = game.fullShootTimer;
			}

		}

		function render() {
			game.contextBackground.clearRect(0, 0, game.width, game.height);
			game.contextBackground.fillStyle = "white";
			for (i in game.stars) {
				var star = game.stars[i];
				game.contextBackground.fillRect(star.x, star.y, star.size, star.size);
			}

			if (!game.player.rendered) {
				game.contextPlayer.clearRect(game.player.x - 10, game.player.y - 10, game.player.width + 20, game.player.height + 20)
				game.contextPlayer.drawImage(game.images[0], game.player.x, game.player.y, game.player.width, game.player.height);
				game.player.rendered = true;
			}

			for (var i in game.enemies) {
				var enemy = game.enemies[i];
				game.contextEnemies.clearRect(enemy.x, enemy.y, enemy.width, enemy.height);
				game.contextEnemies.drawImage(game.images[enemy.image], enemy.x, enemy.y, enemy.width, enemy.height);
			}

			for (var i in game.projectiles) {
				var projectile = game.projectiles[i];
				game.contextEnemies.clearRect(projectile.x, projectile.y, projectile.size, projectile.size);
				game.contextEnemies.drawImage(game.images[projectile.image], projectile.x, projectile.y, projectile.size, projectile.size);
			}
		}

		function loop() {
			requestAnimFrame(function() {
				loop();
			});
			update();
			render();
		}

		function initImages(paths) {
			game.requiredImages = paths.length;
			for (i in paths) {
				var image = new Image();
				image.src = paths[i];
				game.images[i] = image;
				game.images[i].onload = function() {
					game.doneImages++;
				}
			}
		}

		function checkImages() {
			if (game.doneImages >= game.requiredImages) {
				init();
			} else {
				setTimeout(function() {
					checkImages();
				}, 1);
			}
		}

		game.contextBackground.font = "bold 50px monaco";
		game.contextBackground.fillStyle = "white";
		game.contextBackground.fillText("Loading..", game.width / 2 - 100, game.height / 2);
		initImages(["player.png", "enemy.png", "bullet.png"]);
		checkImages();
	});
})();

// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function */ callback, /* DOMElement */ element) {
			window.setTimeout(callback, 1000 / 60);
		};
})();