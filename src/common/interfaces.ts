import { Entity } from '../classes/Entity';

export interface ILevel {
  spriteSheet: string;
  layers: {
    tiles: ITile[];
  }[];
  patterns: IPatterns;
  entities: IEntity[];
}

export interface IEntityFactory {
  [x: string]: () => Entity;
}

export interface IEntity {
  name: string;
  pos: [number, number];
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
