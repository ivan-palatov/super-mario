export interface ILevel {
  backgrounds: IBackground[];
}

export interface IBackground {
  tile: string;
  ranges: number[][];
}
