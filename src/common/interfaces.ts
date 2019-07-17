export interface ILevel {
  spriteSheet: string;
  tiles: ITile[];
  patterns: IPatterns;
}

export interface IPatterns {
  [x: string]: {
    tiles: ITile[];
  };
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
  animations?: Array<{
    name: string;
    frameLen: number;
    frames: string[];
  }>;
}

export interface ITile {
  name?: string;
  pattern?: string;
  type?: string;
  ranges: number[][];
}

export type Context = CanvasRenderingContext2D;
