class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
  static add(point, vector) {
    return new Point(point.x + vector.x, point.y + vector.y);
  }
}

class Vector extends Point {}

class DrawUtil {
  static filledCircle(context, color, position, radius) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(
      Math.trunc(position.x),
      Math.trunc(position.y),
      Math.trunc(radius),
      0,
      2 * Math.PI
    );
    context.fill();
  }
  static circle(context, color, position, radius, thickness) {
    context.strokeStyle = color;
    context.lineWidth = thickness || 2;
    context.beginPath();
    context.arc(
      Math.trunc(position.x),
      Math.trunc(position.y),
      Math.trunc(radius),
      0,
      2 * Math.PI
    );
    context.stroke();
  }
  static filledRect(context, color, start, end) {
    context.fillStyle = color;
    context.fillRect(
      Math.trunc(start.x),
      Math.trunc(start.y),
      Math.trunc(end.x),
      Math.trunc(end.y)
    );
  }
}
