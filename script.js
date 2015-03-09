(function() {
	$(document).ready(function() {
		var game = {};
		game.stars = [];
		game.width = 550;
		game.height = 600;
		game.images = [];
		game.doneImages = 0;
		game.requiredImages = 0;

		game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");
		game.contextPlayer = document.getElementById("playerCanvas").getContext("2d");

		function init() {
			// fill background with stars initially.
			for (var i = 0; i < 600; i++) {
				game.stars.push({
					x: Math.floor(Math.random() * game.width),
					y: Math.floor(Math.random() * game.height),
					size: Math.random() * 5
				});
			}
			game.contextPlayer.drawImage(game.images[1], 10, 10, 100, 100);
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
			for (i in game.stars) {
				if (game.stars.y <= -5) {
					game.stars.splice(i, 1);
				}
				game.stars[i].y--;
			}
		}

		function render() {
			game.contextBackground.clearRect(0, 0, game.width, game.height);
			game.contextBackground.fillStyle = "white";
			for (i in game.stars) {
				var star = game.stars[i];
				game.contextBackground.fillRect(star.x, star.y, star.size, star.size);
			}
		}

		function loop() {
			requestAnimFrame(function() {
				loop();
			});
			update();
			render();
		}

		function initImages(paths){
			game.requiredImages = paths.length;
			for (i in paths){
				var image = new Image();
				image.src = paths[i];
				game.images[i] = image;
				game.images[i].onload = function(){
					game.doneImages++;
				}
			}
		}

		function checkImages(){
			if(game.doneImages >= game.requiredImages){
				init();
			}else{
				setTimeout(function(){
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