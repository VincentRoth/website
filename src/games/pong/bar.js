class Bar {
  constructor(context, color, position, dimension) {
    this.context = context;
    this.color = color;
    this.position = position;
    this.dimension = dimension;
  }

  move(speed, topLimit, bottomLimit) {
    this.position.y += speed.y;
    if (this.position.y < topLimit) {
      this.position.y = topLimit;
    } else if (bottomLimit - this.dimension.y < this.position.y) {
      this.position.y = bottomLimit - this.dimension.y;
    }
  }

  moveTo(target, topLimit, bottomLimit) {
    const deltaY = target.y - this.position.y - this.dimension.y / 2;
    const height = bottomLimit - topLimit;
    const speedY = (Math.sign(deltaY) * height) / 80;
    if (Math.abs(speedY) < Math.abs(deltaY)) {
      this.move(new Vector(0, speedY), topLimit, bottomLimit);
    } else {
      this.move(new Vector(0, deltaY), topLimit, bottomLimit);
    }
  }

  draw() {
    DrawUtil.filledRect(
      this.context,
      this.color,
      this.position,
      this.dimension
    );
  }
}
