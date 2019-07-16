type Callback = (el: { name: string }, x: number, y: number) => void;

export class Vec2 {
  constructor(public x: number, public y: number) {}

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Matrix {
  grid: { name: string; [x: string]: any }[][] = [];

  forEach(callBack: Callback) {
    this.grid.forEach((col, x) => {
      col.forEach((value, y) => {
        callBack(value, x, y);
      });
    });
  }

  get(x: number, y: number) {
    const col = this.grid[x];
    if (col) {
      return col[y];
    }
    return undefined;
  }

  set(x: number, y: number, value: any) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }
    this.grid[x][y] = value;
  }
}
