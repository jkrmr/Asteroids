(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Asteroid = Asteroids.Asteroid = function (pos, vel){
    this.COLOR = "white";
    this.RADIUS = 20;
    this.pos = pos;
    this.vel = vel;

    Asteroids.MovingObject.call(this, pos, vel, this.RADIUS, this.COLOR)
  };

  Asteroid.inherits(Asteroids.MovingObject);

  Asteroid.randomAsteroid = function (dimX, dimY) {
    var pos = Asteroid.randomPosition(dimX, dimY);
    var vel = this.randomVelocity();
    return new Asteroid(pos, vel);
  };

  Asteroid.randomVelocity = function () {
    var randomX = Math.ceil(Math.random() * 11 - 5);
    var randomY = Math.ceil(Math.random() * 11 - 5);

    if (randomX === 0) {
      randomX += 1;
    }
    if (randomY === 0) {
      randomY += 1;
    }

    return [randomX, randomY];
  };

  Asteroid.randomPosition = function (dimX, dimY) {
    var randomX = Math.floor(Math.random() * dimX);
    var randomY = Math.floor(Math.random() * dimY);

    var x = (randomX > dimX * 0.25 && randomX < dimX * 0.75);
    var y = (randomY > dimY * 0.25 && randomY < dimY * 0.75);
    if (x && y) {
      return this.randomPosition(dimX, dimY);
    }
    return [randomX, randomY];
  }

})(this);