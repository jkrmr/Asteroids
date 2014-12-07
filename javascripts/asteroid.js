'use strict';

(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Asteroid = Asteroids.Asteroid = function(pos, vel) {
    this.COLOR  = 'white';
    this.RADIUS = 50;
    this.pos    = pos;
    this.vel    = vel;
    Asteroids.MovingObject.call(this, pos, vel, this.RADIUS, this.COLOR);
  };

  Asteroid.inherits(Asteroids.MovingObject);

  Asteroid.randomAsteroid = function(dimX, dimY) {
    var pos = Asteroid.randomPosition(dimX, dimY);
    var vel = this.randomVelocity();
    return new Asteroid(pos, vel);
  };

  Asteroid.randomVelocity = function() {
    var randomX = Math.ceil(Math.random() * 25 - 5);
    var randomY = Math.ceil(Math.random() * 25 - 5);
    if (randomX === 0) {
      randomX += 10;
    }

    if (randomY === 0) {
      randomY += 10;
    }

    return [randomX, randomY];
  };

  Asteroid.randomPosition = function(dimX, dimY) {
    var randomX = Math.floor(Math.random() * dimX - 10);
    var randomY = Math.floor(Math.random() * dimY - 10);

    var xIsHot = (randomX > dimX * 0.35 && randomX < dimX * 0.65);
    var yIsHot = (randomY > dimY * 0.35 && randomY < dimY * 0.65);

    if (xIsHot || yIsHot) {
      return this.randomPosition(dimX, dimY);
    }

    return [randomX, randomY];
  };
}(window));

