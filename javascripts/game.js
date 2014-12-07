'use strict';

(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function(ctx) {
    this.ctx       = ctx;
    this.level     = 1;
    this.score     = 0;
    this.asteroids = [];
    this.bullets   = [];
    this.ship      = new Asteroids.Ship(this);
    this.addAsteroids(this.level + 10);
    this.bindKeyHandlers();
  };

  Game.DIM_X = 1100;
  Game.DIM_Y = 600;
  Game.FPS   = 60;

  Game.prototype.bindKeyHandlers = function() {
    var _this = this;

    KeyboardJS.on('up', function() {
      _this.ship.power(-1.5);
    });

    KeyboardJS.on('down', function() {
      _this.ship.power(1.5);
    });

    KeyboardJS.on('left', function() {
      _this.ship.rotate(0.25);
    });

    KeyboardJS.on('right', function() {
      _this.ship.rotate(-0.25);
    });

    KeyboardJS.on('space', function() {
      var bullet = _this.ship.fireBullet();
      if (bullet && _this.bullets.length < 10) {
        _this.bullets.push(bullet);
      }
    });
  };

  Game.prototype.addAsteroids = function(num) {
    for (var i = 0; i < num; i += 1) {
      var asteroid = Asteroids.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y);
      this.asteroids.push(asteroid);
    }
  };

  Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ctx.drawImage(img, 0, 0);
    this.displayLevel();
    this.displayShieldStrength();
    this.displayScore();

    if (this.ship.shields <= 50) {
      this.displayShieldStrength('red');
    }

    this.ship.draw(this.ctx);

    var i;

    for (i = 0; i < this.asteroids.length; i += 1) {
      this.asteroids[i].draw(this.ctx);
    }

    for (i = 0; i < this.bullets.length; i += 1) {
      this.bullets[i].draw(this.ctx);
    }
  };

  Game.prototype.move = function() {
    var i;

    this.ship.move();

    for (i = 0; i < this.asteroids.length; i += 1) {
      this.asteroids[i].move();
    }

    for (i = 0; i < this.bullets.length; i += 1) {
      this.bullets[i].move();

      if (this.bullets[i].isOutOfRange()) {
        this.removeBullet(this.bullets[i]);
      }
    }
  };

  Game.prototype.step = function() {
    this.move();
    this.draw(this.ctx);
    this.checkCollisions();
  };

  Game.prototype.start = function() {
    var _this = this;

    this.interval = setInterval(function() {
      _this.step();
    }, Game.FPS);
  };

  Game.prototype.checkCollisions = function() {
    var i;
    for (i = 0; i < this.bullets.length; i += 1) {
      this.bullets[i].hitAsteroids(this.asteroids);
    }

    for (i = 0; i < this.asteroids.length; i += 1) {
      if (this.asteroids[i].isCollidedWith(this.ship)) {
        this.ship.shields -= 10;
        this.removeAsteroid(i);

        if (this.ship.shields > 50) {
          this.ship.drawShield(this.ctx, 'blue');
          this.displayShieldStrength('blue');
        } else {
          this.ship.radius = Asteroids.Ship.SIZE;
          this.ship.draw(this.ctx, 'red');
          this.displayShieldStrength('red');
          if (this.ship.shields <= 0) {
            this.gameStop();
          }
        }
      }
    }
  };

  Game.prototype.gameStop = function() {
    clearInterval(this.interval);

    var goodbye = 'Game Over!\n';
    goodbye += 'You made it to Level ' + this.level + ' ';
    goodbye += 'with a score of ' + this.score + '.\n\n';

    if (this.level > 10) {
      goodbye += 'Outstanding!';
    } else if (this.level > 5) {
      goodbye += 'Great job!';
    } else {
      goodbye += 'Better luck next time!';
    }

    goodbye += '\n\nRefresh the page to start a new game.';

    alert(goodbye);

    // this.asteroids    = [];
    // this.score        = 0;
    // this.ship.shields = 100;
    // this.startNewLevel(1);
  };

  Game.prototype.removeAsteroid = function(index) {
    this.asteroids.splice(index, 1);

    if (this.asteroids.length === 0) {
      this.startNewLevel(this.level + 1);
    }
  };

  Game.prototype.removeBullet = function(bullet) {
    var index = this.bullets.indexOf(bullet);
    this.bullets.splice(index, 1);
  };

  Game.prototype.startNewLevel = function(level) {
    clearInterval(this.interval);
    this.level        = level;
    this.bullets      = [];
    this.ship.resetPosition();
    this.addAsteroids(this.level + 20);
    this.start();
  };

  Game.prototype.displayLevel = function(color) {
    if (typeof color === 'undefined') {
      color = 'white';
    }

    this.ctx.fillStyle = color;
    this.ctx.font = 'bold 15px Helvetica';
    this.ctx.fillText('Level ' + this.level, 10, 30);

  };

  Game.prototype.displayShieldStrength = function(color) {
    if (typeof color === 'undefined') {
      color = 'white';
    }

    this.ctx.fillStyle   = color;
    this.ctx.strokeStyle = color;
    this.ctx.font        = 'bold 14px Helvetica';
    this.ctx.fillText('▲ ' + this.ship.shields, 10, 50);
  };

  Game.prototype.displayScore = function(color) {
    if (typeof color === 'undefined') {
      color = 'white';
    }

    this.ctx.fillStyle   = color;
    this.ctx.strokeStyle = color;
    this.ctx.font        = 'bold 14px Helvetica';
    this.ctx.fillText('☆ ' + this.score, 10, 70);
  };

})(this);
