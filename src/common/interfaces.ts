export interface ILevel {
  spriteSheet: string;
  backgrounds: IBackground[];
}

export interface ISpriteSheet {
  imageURL: string;
  tileW: number;
  tileH: number;
  tiles?: Array<{
    name: string;
    index: number[];
  }>;
  frames?: Array<{
    name: string;
    rect: number[];
  }>;
}

export interface IBackground {
  tile: string;
  type?: string;
  ranges: number[][];
}

export type Context = CanvasRenderingContext2D;
