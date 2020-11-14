/* exported Point Vector DrawUtil */

class Point {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  add (vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  copy () {
    return new Point(this.x, this.y);
  }
}

class Vector extends Point { }

class DrawUtil {
  static filledCircle (context, color, position, radius) {
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

  static circle (context, color, position, radius, thickness = 2) {
    context.strokeStyle = color;
    context.lineWidth = thickness;
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

  static filledRect (context, color, start, end) {
    context.fillStyle = color;
    context.fillRect(
      Math.trunc(start.x),
      Math.trunc(start.y),
      Math.trunc(end.x),
      Math.trunc(end.y)
    );
  }

  static setFont (context, font, size) {
    context.font = `${Math.trunc(size)}pt "${font}"`;
  }

  static computeFontSize (context, text, font, size, limit) {
    DrawUtil.setFont(context, font, size);
    const metrics = context.measureText(text);
    if (metrics.width > limit) {
      DrawUtil.computeFontSize(context, text, font, size - 1, limit);
    }
  }
}
