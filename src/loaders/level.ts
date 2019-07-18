import { Level } from '../classes/Level';
import { Matrix } from '../classes/math';
import { SpriteSheet } from '../classes/SpriteSheet';
import { IEntityFactory, ILevel, IPatterns, ITile } from '../common/interfaces';
import { createBackgroundLayer } from '../layers/background';
import { createSpriteLayer } from '../layers/sprite';
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
    yield* expandRange(range);
  }
}

function* expandTiles(tiles: ITile[], patterns: IPatterns) {
  function* walkTiles(
    tiles: ITile[],
    offsetX: number,
    offsetY: number
  ): IterableIterator<{ tile: ITile; x: number; y: number }> {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const patternTiles = patterns[tile.pattern].tiles;
          yield* walkTiles(patternTiles, derivedX, derivedY);
        } else {
          yield {
            tile,
            x: derivedX,
            y: derivedY,
          };
        }
      }
    }
  }

  yield* walkTiles(tiles, 0, 0);
}

function createCollisionGrid(tiles: ITile[], patterns: IPatterns) {
  const grid = new Matrix();
  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { type: tile.type });
  }

  return grid;
}

function createBackgroundGrid(tiles: ITile[], patterns: IPatterns) {
  const grid = new Matrix();
  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { name: tile.name });
  }

  return grid;
}

function setupCollision(levelSpec: ILevel, level: Level) {
  const mergedTiles = levelSpec.layers.reduce(
    (m, l) => [...m, ...l.tiles],
    [] as ITile[]
  );
  const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
  level.setCollisionGrid(collisionGrid);
}

function setupBackground(lvl: ILevel, level: Level, bgSprites: SpriteSheet) {
  lvl.layers.forEach(layer => {
    const backgroundGrid = createBackgroundGrid(layer.tiles, lvl.patterns);
    const backgroundLayer = createBackgroundLayer(
      level,
      backgroundGrid,
      bgSprites
    );
    level.comp.layers.push(backgroundLayer);
  });
}

function setupEntities(
  levelSpec: ILevel,
  level: Level,
  entityFactory: IEntityFactory
) {
  levelSpec.entities.forEach(({ name, pos: [x, y] }) => {
    const createEntity = entityFactory[name];
    const entity = createEntity();
    entity.pos.set(x, y);
    level.entities.add(entity);
  });

  const spriteLayer = createSpriteLayer(level.entities);
  level.comp.layers.push(spriteLayer);
}

export function createLevelLoader(entityFactory: IEntityFactory) {
  return async function loadLevel(name: string): Promise<Level> {
    const levelSpec = await loadJSON<ILevel>(`./levels/${name}`);
    const backgroundSprites = await loadSpriteSheet(levelSpec.spriteSheet);
    const level = new Level();

    setupCollision(levelSpec, level);
    setupBackground(levelSpec, level, backgroundSprites);
    setupEntities(levelSpec, level, entityFactory);

    return level;
  };
}
