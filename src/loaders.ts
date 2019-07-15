import { ILevel } from './common/interfaces';

export function loadImage(url: string) {
  return new Promise<HTMLImageElement>(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export async function loadLevel(name: string): Promise<ILevel> {
  const res = await fetch(`./levels/${name}.json`);
  return res.json();
}
