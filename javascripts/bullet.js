(function (root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(pos, speed, angle, game) {
    this.pos = pos;
    this.speed = speed;
    this.angle = angle;
    this.game = game;

    Asteroids.MovingObject.call(this, this.pos, this.vel, Bullet.RADIUS, Bullet.COLOR);
  }

  Bullet.RADIUS = 3;
  Bullet.COLOR = 'red';

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.prototype.move = function () {
    this.pos[0] -= Math.sin(this.angle) * this.speed;
    this.pos[1] -= Math.cos(this.angle) * this.speed;
  };

  Bullet.prototype.hitAsteroids = function (asteroids) {
    for (var i = 0; i < asteroids.length; i++) {
      if (asteroids[i].isCollidedWith(this)) {
        this.game.removeAsteroid(i);
        this.game.removeBullet(this);
      }
    }
  };

  Bullet.prototype.isOutOfRange = function () {
    return (this.pos[0] < 0 ||
      this.pos[0] > Asteroids.Game.DIM_X ||
      this.pos[1] < 0 ||
      this.pos[1] > Asteroids.Game.DIM_Y);
  };

})(this);