export interface ILevel {
  spriteSheet: string;
  backgrounds: IBackground[];
  patterns: IPatterns;
}

export interface IPatterns {
  [x: string]: {
    backgrounds: IBackground[];
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

export interface IBackground {
  tile?: string;
  type?: string;
  pattern?: string;
  ranges: number[][];
}

export type Context = CanvasRenderingContext2D;
