import { Level } from '../classes/Level';
import { ILevel, IPatterns, ITile } from '../common/interfaces';
import { createBackgroundLayer, createSpriteLayer } from '../layers';
import { loadJSON, loadSpriteSheet } from '../loaders';

function* expandSpan(
  xStart: number,
  xLen: number,
  yStart: number,
  yLen: number
) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;
  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      yield { x, y };
    }
  }
}

function expandRange(range: number[]) {
  if (range.length === 4) {
    const [xStart, xLen, yStart, yLen] = range;
    return expandSpan(xStart, xLen, yStart, yLen);
  } else if (range.length === 3) {
    const [xStart, xLen, yStart] = range;
    return expandSpan(xStart, xLen, yStart, 1);
  } else {
    const [xStart, yStart] = range;
    return expandSpan(xStart, 1, yStart, 1);
  }
}

function* expandRanges(ranges: number[][]) {
  for (const range of ranges) {
    for (const item of expandRange(range)) {
      yield item;
    }
  }
}

function expandTiles(tiles: ITile[], patterns: IPatterns) {
  const expandedTiles: Array<{ x: number; y: number; tile: ITile }> = [];

  function walkTiles(tiles: ITile[], offsetX: number, offsetY: number) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const patternTiles = patterns[tile.pattern].tiles;
          walkTiles(patternTiles, derivedX, derivedY);
        } else {
          expandedTiles.push({
            tile,
            x: derivedX,
            y: derivedY,
          });
        }
      }
    }
  }

  walkTiles(tiles, 0, 0);
  return expandedTiles;
}

export async function loadLevel(name: string): Promise<Level> {
  const levelSpec = await loadJSON<ILevel>(`./levels/${name}`);
  const backgroundSprites = await loadSpriteSheet(levelSpec.spriteSheet);
  const level = new Level();

  for (const { tile, x, y } of expandTiles(
    levelSpec.tiles,
    levelSpec.patterns
  )) {
    level.tiles.set(x, y, {
      name: tile.name,
      type: tile.type,
    });
  }

  const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
  level.comp.layers.push(backgroundLayer);
  const spriteLayer = createSpriteLayer(level.entities);
  level.comp.layers.push(spriteLayer);

  return level;
}
