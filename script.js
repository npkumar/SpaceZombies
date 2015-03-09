(function() {
	$(document).ready(function() {
		var game = {};
		game.stars = [];
		game.width = 550;
		game.height = 600;

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
				if(game.stars.y <= -5){
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
				update();
				render();
				loop();
			});
		}
		init();
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