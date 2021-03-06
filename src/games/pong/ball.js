/* global DrawUtil */
/* exported Ball */

class Ball {
  constructor (context, radius, color, position, speed) {
    this.context = context;
    this.radius = radius;
    this.color = color;
    this.startPosition = position.copy();
    this.position = position.copy();
    this.startSpeed = speed.copy();
    this.speed = speed.copy();
  }

  move () {
    this.position.add(this.speed);
  }

  isBeforeX (x) {
    return this.position.x - this.radius < x;
  }

  isAfterX (x) {
    return x < this.position.x + this.radius;
  }

  isWithinYInterval (top, bottom) {
    return top < this.position.y + this.radius && this.position.y - this.radius < bottom;
  }

  bounceOnBars (bar1, bar2) {
    if (
      this.isBeforeX(bar1.position.x + bar1.dimension.x)
      && this.isWithinYInterval(bar1.position.y, bar1.position.y + bar1.dimension.y)
      && this.speed.x < 0
    ) {
      this.speed.x *= -1;
      this.speed.x++;
      const deltaY = this.position.y - (bar1.position.y + bar1.dimension.y / 2);
      this.speed.y = deltaY * 0.3;
    } else if (
      this.isAfterX(bar2.position.x)
      && this.isWithinYInterval(bar2.position.y, bar2.position.y + bar2.dimension.y)
      && this.speed.x > 0
    ) {
      this.speed.x *= -1;
      this.speed.x++;
      const deltaY = this.position.y - (bar2.position.y + bar2.dimension.y / 2);
      this.speed.y = deltaY * 0.3;
    }
  }

  bounceOnWalls (start, end) {
    if (this.position.y - this.radius < start.y || end.y < this.position.y + this.radius) {
      this.speed.y *= -1;
    }
  }

  reset () {
    this.position = this.startPosition.copy();
    this.speed = this.startSpeed.copy();
  }

  service () {
    const inversedSpeedDirection = -1 * Math.sign(this.speed.x);
    this.reset();
    this.speed.x = inversedSpeedDirection * this.speed.x;
  }

  draw () {
    DrawUtil.filledCircle(this.context, this.color, this.position, this.radius);
  }
}
