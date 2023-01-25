import { Nullable } from '../../utils';
import { CellButtonColor } from '../ui-kit';

export const resetCanvas = (ctx: Nullable<CanvasRenderingContext2D>, width: number, height: number) => {
  if (!ctx) return;
  ctx.fillStyle = `#fff`;
  ctx.fillRect(0, 0, width, height);
};

const cellStep = 10;

const convertToMultipleOfCellStep = (num: number) => {
  const divisionRemainder = num % 10;
  if (divisionRemainder === 0) {
    return num;
  } else {
    return num + (cellStep - divisionRemainder);
  }
};

const drawLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string = 'lightgrey') => {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineJoin = 'miter';
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string = 'blue') => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineJoin = 'miter';
  ctx.lineWidth = 1;
  ctx.fillRect(x, y, cellStep, cellStep);
  ctx.fill();
};

export const drawCellByCanvasScreen = (ctx: Nullable<CanvasRenderingContext2D>, width: number, height: number) => {
  if (!ctx) return;
  const multipleOfTenWidth = convertToMultipleOfCellStep(width);
  const multipleOfTenHeight = convertToMultipleOfCellStep(height);
  for (let x = 0; x < multipleOfTenWidth; x += cellStep) {
    drawLine(ctx, x, 0, x, height);
  }
  for (let y = 0; y < multipleOfTenHeight; y += cellStep) {
    drawLine(ctx, 0, y, width, y);
  }
};

export const freeDraw = (ctx: CanvasRenderingContext2D, width: number, height: number, color: CellButtonColor) => {
  let isMouseDown = false;

  const mouseDownCallback = (e: MouseEvent) => {
    if (e.clientX > width) return;
    isMouseDown = true;
    ctx.beginPath();
  };
  const mouseUpCallback = (e: MouseEvent) => {
    if (e.clientX > width) return;
    isMouseDown = false;
  };
  const mouseMoveCallback = (e: MouseEvent) => {
    if (!isMouseDown) return;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = color === 'white' ? cellStep * 5 : cellStep;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, cellStep / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  };

  return {
    mouseDownCallback,
    mouseUpCallback,
    mouseMoveCallback,
  };
};

export const drawGrid = (ctx: Nullable<CanvasRenderingContext2D>, width: number, height: number, isDraw: boolean) => {
  if (!ctx) return;
  const whiteNum = 255;
  const transparentNum = 0;
  const pixelsXCount = width / cellStep;
  const pixelsYCount = height / cellStep;
  const xStep = width / pixelsXCount;
  const yStep = height / pixelsYCount;

  const vector = [];
  const __draw = [];

  for (let x = 0; x < width; x += xStep) {
    for (let y = 0; y < height; y += yStep) {
      const pixelCell = ctx.getImageData(x, y, xStep, yStep);
      let nonEmptyPixels = 0;
      for (let i = 0; i < pixelCell.data.length; i++) {
        if (!(pixelCell.data[i] === transparentNum) && !(pixelCell.data[i] === whiteNum)) {
          nonEmptyPixels += 1;
        }
      }
      if (nonEmptyPixels > 0 && isDraw) {
        __draw.push([x, y, xStep, yStep]);
      }
      vector.push(nonEmptyPixels > 0 ? 1 : 0);
    }
  }

  if (isDraw) {
    resetCanvas(ctx, width, height);
    drawCellByCanvasScreen(ctx, width, height);

    for (let i = 0; i < __draw.length; i++) {
      const it = __draw[i];
      drawCell(ctx, it[0], it[1], it[2], it[3]);
    }
  }

  return vector;
};
