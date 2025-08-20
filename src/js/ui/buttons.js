export class Button {
  /**
   * onClick: (x, y) {...}
   * onDraw: (context) {...}
   */
  constructor(name, x, y, width, height, onClick, onDraw) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.onClick = onClick;
    this.onDraw = onDraw;
  }

  draw(context) {
    context.save();
    this.onDraw(context);
    context.restore();
  }
}
