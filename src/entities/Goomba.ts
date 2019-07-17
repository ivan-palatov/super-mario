import { Entity } from '../classes/Entity';
import { SpriteSheet } from '../classes/SpriteSheet';
import { PendulumWalk } from '../classes/traits/PendulumWalk';
import { Context } from '../common/interfaces';
import { loadSpriteSheet } from '../loaders';

export async function loadGoomba() {
  const sprite = await loadSpriteSheet('goomba');
  return createGoombaFactory(sprite);
}

function createGoombaFactory(sprite: SpriteSheet) {
  const walkAnim = sprite.animations.get('walk')!;

  return function createGoomba() {
    const goomba = new Entity();
    goomba.size.set(16, 16);

    goomba.addTrait(new PendulumWalk());

    goomba.draw = function drawGoomba(ctx: Context) {
      sprite.draw(walkAnim(this.lifeTime), ctx, 0, 0);
    };

    return goomba;
  };
}
