(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Ship = Asteroids.Ship = function (game) {
    this.shields = 100;
    this.pos     = [Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y * 2.5 / 3];
    this.angle   = 0;
    this.radius  = 40;
    this.game    = game;
    Asteroids.MovingObject.call(this, this.pos, [0, 0], this.radius, Ship.COLOR)
  }

  Ship.inherits(Asteroids.MovingObject);

  Ship.SIZE   = 10;
  Ship.COLOR  = "white";
  Ship.SHIELD = "blue";

  Ship.prototype.rotate = function (torque) {
    this.angle += torque;
  };

  Ship.prototype.power = function (impulse) {
    this.vel[0] += (Math.sin(this.angle) * 1.5) * impulse;
    this.vel[1] += (Math.cos(this.angle) * 1.5) * impulse;
  };

  Ship.prototype.draw = function (ctx, color) {
    if (typeof color === 'undefined') color = this.color;
    ctx.strokeStyle = color;
    ctx.fillStyle   = color;
    ctx.beginPath();

    var dx1 = Math.sin(this.angle)       * Ship.SIZE;
    var dy1 = Math.cos(this.angle)       * Ship.SIZE;
    var dx2 = Math.sin(this.angle + 4.7) * Ship.SIZE;
    var dy2 = Math.cos(this.angle + 4.7) * Ship.SIZE;
    var dx3 = Math.sin(this.angle - 4.7) * Ship.SIZE;
    var dy3 = Math.cos(this.angle - 4.7) * Ship.SIZE;

    ctx.moveTo(this.pos[0] - dx1, this.pos[1] - dy1);
    ctx.lineTo(this.pos[0] - dx2, this.pos[1] - dy2);
    ctx.lineTo(this.pos[0] - dx3, this.pos[1] - dy3);
    ctx.lineTo(this.pos[0] - dx1, this.pos[1] - dy1);

    // TODO: 1. implement tail dimple
    // TODO: 2. Millenium Falcon
    // TODO: 3. pitching and yawing

    ctx.stroke();
    ctx.fill();
  };

  Ship.prototype.drawShield = function (ctx, color) {
    if (typeof color === 'undefined') color = this.shield;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = color
    ctx.stroke();
  };

  Ship.prototype.fireBullet = function () {
      bulletPosn = [this.pos[0], this.pos[1]]
      speed = Math.sqrt(this.vel[0] * this.vel[0] + this.vel[1] * this.vel[1]);
      this.power(1);
      return new Asteroids.Bullet(bulletPosn, speed + 30, this.angle, this.game);
  };

  Ship.prototype.resetPosition = function () {
    this.pos   = [Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y * 2.5 / 3];
    this.angle = 0;
    this.vel   = [0,0];
  };
})(this);