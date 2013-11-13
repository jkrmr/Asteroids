(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Ship = Asteroids.Ship = function (game) {
    this.pos   = [Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y / 2];
    this.angle = 0;
    this.game  = game;
    Asteroids.MovingObject.call(this, this.pos, [0, 0], Ship.RADIUS, Ship.COLOR)
  }

  Ship.RADIUS = 10;
  Ship.COLOR  = "white";

  Ship.inherits(Asteroids.MovingObject);

  Ship.prototype.rotate = function (torque) {
    this.angle += torque;
  };

  Ship.prototype.power = function (impulse) {
    this.vel[0] += (Math.sin(this.angle) * 1.5) * impulse;
    this.vel[1] += (Math.cos(this.angle) * 1.5) * impulse;
  };

  Ship.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    var dx1 = Math.sin(this.angle)     * Ship.RADIUS;
    var dy1 = Math.cos(this.angle)     * Ship.RADIUS;
    var dx2 = Math.sin(this.angle + 4) * Ship.RADIUS;
    var dy2 = Math.cos(this.angle + 4) * Ship.RADIUS;
    var dx3 = Math.sin(this.angle - 4) * Ship.RADIUS;
    var dy3 = Math.cos(this.angle - 4) * Ship.RADIUS;

    ctx.moveTo(this.pos[0] - dx1, this.pos[1] - dy1);
    ctx.lineTo(this.pos[0] - dx2, this.pos[1] - dy2);
    ctx.lineTo(this.pos[0] - dx3, this.pos[1] - dy3);
    ctx.lineTo(this.pos[0] - dx1, this.pos[1] - dy1);

    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.fill();
  };

  Ship.prototype.fireBullet = function () {
      bulletPosn = [this.pos[0], this.pos[1]]
      speed = Math.sqrt(this.vel[0] * this.vel[0] + this.vel[1] * this.vel[1]);
      return new Asteroids.Bullet(bulletPosn, speed + 30, this.angle, this.game);
  };

  Ship.prototype.resetPosition = function () {
    this.pos   = [Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y / 2];
    this.angle = 0;
    this.vel   = [0, 0];
  };
})(this);