window.onload = function() {
	//start crafty
	Crafty.init(640, 640);
	Crafty.canvas();

	//turn the sprite map into usable components
	Crafty.sprite(16, "images/sprite.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		flower: [0,1],
		bush1: [0,2],
		bush2: [1,2],
		player: [0,3]
	});

	Crafty.sprite(192, "images/goldieSpriteSheet.png", {
		fish: [0,0]
	});

	Crafty.sprite(640, "images/pipe.png", {
		pipe: [0,0]
	});
	Crafty.sprite(190, "images/valveRight.png", {
		valveRight: [0,0]
	});
	Crafty.sprite(170, "images/valveLeft.png", {
		valveLeft: [0,0]
	});
	Crafty.sprite(256, "images/valveTop.png", {
		valveTopt: [0,0]
	});
	Crafty.sprite(256, "images/valveBottom.png", {
		valveBottom: [0,0]
	});

	//method to randomy generate the map
	function generateWorld() {
		//generate the grass along the x-axis
		for(var i = 0; i < 25; i++) {
			//generate the grass along the y-axis
			for(var j = 0; j < 20; j++) {
				grassType = Crafty.randRange(1, 4);
				Crafty.e("2D, Canvas, grass"+grassType)
					.attr({x: i * 16, y: j * 16});

				//1/50 chance of drawing a flower and only within the bushes
				if(i > 0 && i < 24 && j > 0 && j < 19 && Crafty.randRange(0, 50) > 49) {
					Crafty.e("2D, DOM, flower, Animate")
						.attr({x: i * 16, y: j * 16})
						.animate("wind", 0, 1, 3)
						.bind("enterframe", function() {
							if(!this.isPlaying())
								this.animate("wind", 80);
						});
				}
			}
		}

		//create the bushes along the x-axis which will form the boundaries
		for(var i = 0; i < 25; i++) {
			Crafty.e("2D, Canvas, wall_top, bush"+Crafty.randRange(1,2))
				.attr({x: i * 16, y: 0, z: 2});
			Crafty.e("2D, DOM, wall_bottom, bush"+Crafty.randRange(1,2))
				.attr({x: i * 16, y: 304, z: 2});
		}

		//create the bushes along the y-axis
		//we need to start one more and one less to not overlap the previous bushes
		for(var i = 1; i < 19; i++) {
			Crafty.e("2D, DOM, wall_left, bush"+Crafty.randRange(1,2))
				.attr({x: 0, y: i * 16, z: 2});
			Crafty.e("2D, Canvas, wall_right, bush"+Crafty.randRange(1,2))
				.attr({x: 384, y: i * 16, z: 2});
		}
	}

	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["images/sprite.png"], function() {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});

		//black background with some loading text
		Crafty.background("#485f7b");
		Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
			.text("Loading")
			.css({"text-align": "center"});
	});

	//automatically play the loading scene
	Crafty.scene("loading");

	Crafty.scene("main", function() {
		//generateWorld();

		Crafty.c('CustomControls', {
			__move: {left: false, right: false, up: false, down: false},
			_speed: 3,

			CustomControls: function(speed) {
				if(speed) this._speed = speed;
				var move = this.__move;

				this.bind('enterframe', function() {
					//move the player in a direction depending on the booleans
					//only move the player in one direction at a time (up/down/left/right)
					if(this.isDown("RIGHT_ARROW")) this.x += this._speed;
					else if(this.isDown("LEFT_ARROW")) this.x -= this._speed;
					else if(this.isDown("UP_ARROW")) this.y -= this._speed;
					else if(this.isDown("DOWN_ARROW")) this.y += this._speed;
				});

				return this;
			}
		});

		var tube = new Array(2);
		for (var i = 0; i < 2; i++) {
			tube[i] = Crafty.e("2D, Canvas, pipe")
			//.origin("center")
			.attr({x: 310 - (i * 50), y: 310 - (i * 50), z: 10 - i, w: 10 + (i * 100), h: 10 + (i * 100)})
			//.attr({x: 320, y: 310, z: 10 - i, w: 10 + (i * 100), h: 10 + (i * 100)})
			.bind("enterframe", function(e) {
					var scale = this.w / 250;
					this.w += scale * 2;
					this.h += scale * 2;
					this.x -= scale;
					this.y -= scale;
					//this.x = 320;
					//this.y = 320;
					if (this.w >= 1200) {
						this.attr({x: 310, y: 310, w: 10, h: 10});
						this.z++;
						if (this.z == 100) {
							for (i = 0; i < tube.length; i++)
							{
								tube[i].z -= 99 - tube.length;
							}
						}
						//this.rotation = Math.random() * 360;
					}
			});

		}

		valveRight = Crafty.e("2D, Canvas, valveRight")
			.attr({x: 320, y: 192, z: 200, w: 1, h: 1})
			.bind("enterframe", function(e) {
					var scale = this.w / 250;
					this.w += scale * 2;
					this.h += scale * 2;
					this.x = 320 + 50;
					this.y = 320 - (this.h/ 2);
					//this.y -= scale;
					if (this.w >= 1200) {
						this.attr({x: 320, y: 192, w: 1, h: 1});
					}
			});


		valveLeft = Crafty.e("2D, Canvas, valveLeft")
			.attr({x: 320, y: 192, z: 200, w: 1, h: 1})
			.bind("enterframe", function(e) {
					var scale = this.w / 250;
					this.w += scale * 2;
					this.h += scale * 2;
					this.x = 320 - this.w - 50;
					this.y = 320 - (this.h/ 2);
					//this.y -= scale;
					if (this.w >= 1200) {
						this.attr({x: 320, y: 192, w: 1, h: 1});
					}
			});


		//create our player entity with some premade components
		player = Crafty.e("2D, Canvas, fish, Controls, CustomControls, Animate, Collision")
			.attr({x: 320, y: 320, z: 310, w: 256, h: 256})
			.CustomControls(1)
			//.animate("walk_left", 0, 0, 9)
			//.animate("walk_left", [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[8,0],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0],[1,0],[0,0]])
			.animate("walk_left", [[0,0],[192,0],[384,0]])
			//.animate("walk_left", [{x:0, y:0}, {x:1, y:0}])
			//.animate("walk_left", 0, 0, 9)
			//.animate("walk_right", 9, 3, 11)
			//.animate("walk_up", 3, 3, 5)
			//.animate("walk_down", 0, 3, 2)
			.bind("enterframe", function(e) {
				if (!this.isPlaying("walk_left"))
					this.animate("walk_left", 50);

				if(this.isDown("LEFT_ARROW")) {
					if(!this.isPlaying("walk_left"))
						this.stop().animate("walk_left", 10);
				} else if(this.isDown("RIGHT_ARROW")) {
					if(!this.isPlaying("walk_right"))
						this.stop().animate("walk_right", 10);
				} else if(this.isDown("UP_ARROW")) {
					if(!this.isPlaying("walk_up"))
						this.stop().animate("walk_up", 10);
				} else if(this.isDown("DOWN_ARROW")) {
					if(!this.isPlaying("walk_down"))
						this.stop().animate("walk_down", 10);
				}
			}).bind("keyup", function(e) {
				this.stop();
			})
			.collision()
			.onHit("wall_left", function() {
				this.x += this._speed;
				this.stop();
			}).onHit("wall_right", function() {
				this.x -= this._speed;
				this.stop();
			}).onHit("wall_bottom", function() {
				this.y -= this._speed;
				this.stop();
			}).onHit("wall_top", function() {
				this.y += this._speed;
				this.stop();
			});
	});
};