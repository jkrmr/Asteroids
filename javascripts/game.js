(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function (ctx) {
    this.ctx       = ctx;
    this.level     = 1;
    this.score     = 0;
    this.asteroids = [];
    this.bullets   = [];
    this.ship      = new Asteroids.Ship(this);
    this.addAsteroids(this.level+10);
    this.bindKeyHandlers();
  };

  Game.DIM_X = 1100;
  Game.DIM_Y = 600;
  Game.FPS   = 60;

  Game.prototype.bindKeyHandlers = function () {
    var that = this;
    KeyboardJS.on("up",    function(){ that.ship.power(-1.5) });
    KeyboardJS.on("down",  function(){ that.ship.power( 1.5) });
    KeyboardJS.on("left",  function(){ that.ship.rotate( 0.25) });
    KeyboardJS.on("right", function(){ that.ship.rotate(-0.25) });
    KeyboardJS.on("space", function(){
      var bullet = that.ship.fireBullet();
      if (bullet && that.bullets.length < 10)
        that.bullets.push(bullet);
    });
  };

  Game.prototype.addAsteroids = function (num) {
    for (var i = 0; i < num; i++) {
      var asteroid = Asteroids.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y)
      this.asteroids.push(asteroid);
    }
  };

  Game.prototype.draw = function () {
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ctx.drawImage(img, 0, 0);
    this.displayLevel();
    this.displayShieldStrength();
    this.displayScore();
    if (this.ship.shields <= 50) this.displayShieldStrength('red')
    this.ship.draw(this.ctx);
    for (var i = 0; i < this.asteroids.length; i++)
      this.asteroids[i].draw(this.ctx);
    for (var i = 0; i < this.bullets.length; i++)
      this.bullets[i].draw(this.ctx);
  };

  Game.prototype.move = function () {
    this.ship.move();
    for (var i = 0; i < this.asteroids.length; i++) this.asteroids[i].move();
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].move();
      if (this.bullets[i].isOutOfRange()) this.removeBullet(this.bullets[i]);
    }
  };

  Game.prototype.step = function () {
    this.move();
    this.draw(this.ctx);
    this.checkCollisions();
  };

  Game.prototype.start = function () {
    var that = this;
    this.interval = setInterval(function () { that.step(); }, Game.FPS);
  };

  Game.prototype.checkCollisions = function () {
    for (var i = 0; i < this.bullets.length; i++){
      this.bullets[i].hitAsteroids(this.asteroids);
    }
    for (var i = 0; i < this.asteroids.length; i++)
      if (this.asteroids[i].isCollidedWith(this.ship)){
        this.ship.shields -= 10;
        this.removeAsteroid(i);
        if (this.ship.shields > 50) {
          this.ship.drawShield(this.ctx, "blue")
          this.displayShieldStrength("blue");
        } else {
          this.ship.radius = Asteroids.Ship.SIZE;
          this.ship.draw(this.ctx, "red");
          this.displayShieldStrength("red");
          if (this.ship.shields <= 0) this.gameStop();
        }
      }
  };

  Game.prototype.gameStop = function () {
    clearInterval(this.interval);

    var goodbye = "Game Over!\n";
    goodbye += "You made it to Level " + this.level + " ";
    goodbye += "with a score of " + this.score + ".\n\n";

    if (this.level > 10) goodbye += "Outstanding!";
    else if (this.level > 5 ) goodbye += "Great job!";
    else goodbye += "Better luck next time!";

    goodbye += "\n\nRefresh the page to start a new game.";

    alert(goodbye);

    // this.asteroids    = [];
    // this.score        = 0;
    // this.ship.shields = 100;
    // this.startNewLevel(1);
  };

  Game.prototype.removeAsteroid = function (index) {
    this.asteroids.splice(index, 1);
    if (this.asteroids.length === 0)
      this.startNewLevel(this.level + 1);
  };

  Game.prototype.removeBullet = function (bullet) {
    var index = this.bullets.indexOf(bullet);
    this.bullets.splice(index, 1);
  };

  Game.prototype.startNewLevel = function (level) {
    clearInterval(this.interval);
    this.level        = level;
    this.bullets      = [];
    this.ship.resetPosition();
    this.addAsteroids(this.level + 20);
    this.start();
  };

  Game.prototype.displayLevel = function (color) {
    if (typeof color === 'undefined') color = 'white';
    this.ctx.fillStyle = color;
    this.ctx.font = "bold 15px Helvetica";
    this.ctx.fillText("Level " + this.level, 10, 30);

  };

  Game.prototype.displayShieldStrength = function (color) {
    if (typeof color === 'undefined') color = 'white';
    this.ctx.fillStyle   = color;
    this.ctx.strokeStyle = color;
    this.ctx.font        = "bold 14px Helvetica";
    this.ctx.fillText("▲ " + this.ship.shields, 10, 50);
  };

  Game.prototype.displayScore = function (color) {
    if (typeof color === 'undefined') color = 'white';
    this.ctx.fillStyle   = color;
    this.ctx.strokeStyle = color;
    this.ctx.font        = "bold 14px Helvetica";
    this.ctx.fillText("☆ " + this.score, 10, 70);
  };
})(this);