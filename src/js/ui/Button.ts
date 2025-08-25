export class Button {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
  onDraw: (context: CanvasRenderingContext2D) => void;

  constructor(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    onClick: () => void,
    onDraw: (context: CanvasRenderingContext2D) => void
  ) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.onClick = onClick;
    this.onDraw = onDraw;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.save();
    this.onDraw(context);
    context.restore();
  }
}
