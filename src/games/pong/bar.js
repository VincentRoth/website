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
    this.move(new Vector(0, deltaY / 30), topLimit, bottomLimit);
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
