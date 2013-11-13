(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function (ctx) {
    this.ctx = ctx;
    this.level = 1;
    this.asteroids = [];
    this.addAsteroids(this.level+10);
    this.bullets = [];
    this.ship = new Asteroids.Ship(this);
    this.bindKeyHandlers();
  };

  Game.DIM_X = 1200;
  Game.DIM_Y = 600;
  Game.FPS = 60;

  Game.prototype.bindKeyHandlers = function () {
    var that = this;
    KeyboardJS.on("up",    function(){ that.ship.power(-1.5) });
    KeyboardJS.on("down",  function(){ that.ship.power( 1.5) });
    KeyboardJS.on("left",  function(){ that.ship.rotate( 0.35) });
    KeyboardJS.on("right", function(){ that.ship.rotate(-0.35) });
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
    for (var i = 0; i < this.bullets.length; i++)
      this.bullets[i].hitAsteroids(this.asteroids);
    for (var i = 0; i < this.asteroids.length; i++)
      if (this.asteroids[i].isCollidedWith(this.ship))
        this.gameStop();
  };

  Game.prototype.gameStop = function () {
    this.asteroids = [];
    this.startNewLevel(1);
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
    this.level = level;
    this.bullets = [];
    this.ship.resetPosition();
    this.addAsteroids(this.level + 20);
    this.start();
  };

  Game.prototype.displayLevel = function () {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText("Level " + this.level, 10, 30);
  };
})(this);