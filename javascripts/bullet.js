(function (root){
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(pos, speed, angle, game) {
    this.pos   = pos;
    this.speed = speed;
    this.angle = angle;
    this.game  = game;
    Asteroids.MovingObject.call(this, this.pos, this.vel, Bullet.RADIUS, Bullet.COLOR);
  }

  Bullet.RADIUS = 2;
  Bullet.COLOR  = 'white';

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.prototype.draw = function (ctx) {
    ctx.save();
    ctx.strokeStyle   = '#fcfcfc';
    ctx.fillStyle     = this.color;
    ctx.shadowColor   = '#fcfcfc';
    ctx.shadowBlur    = 100;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI, false);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  };

  Bullet.prototype.move = function () {
    this.pos[0] -= Math.sin(this.angle) * this.speed;
    this.pos[1] -= Math.cos(this.angle) * this.speed;
  };

  Bullet.prototype.hitAsteroids = function (asteroids) {
    for (var i = 0; i < asteroids.length; i++)
      if (asteroids[i].isCollidedWith(this)) {
        this.game.removeAsteroid(i);
        this.game.removeBullet(this);
        this.game.score += 10;
        this.game.displayScore("green");
      }
  };

  Bullet.prototype.isOutOfRange = function () {
    return ( this.pos[0] < 0 ||
             this.pos[0] > Asteroids.Game.DIM_X ||
             this.pos[1] < 0 ||
             this.pos[1] > Asteroids.Game.DIM_Y );
  };
})(this);