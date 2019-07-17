import { Entity } from '../classes/Entity';
import { SpriteSheet } from '../classes/SpriteSheet';
import { PendulumWalk } from '../classes/traits/PendulumWalk';
import { Context } from '../common/interfaces';
import { loadSpriteSheet } from '../loaders';

export async function loadKoopa() {
  const sprite = await loadSpriteSheet('koopa');
  return createKoopaFactory(sprite);
}

function createKoopaFactory(sprite: SpriteSheet) {
  const walkAnim = sprite.animations.get('walk')!;

  return function createKoopa() {
    const koopa = new Entity();
    koopa.size.set(16, 16);
    koopa.offset.y = 8;

    koopa.addTrait(new PendulumWalk());

    koopa.draw = function drawKoopa(ctx: Context) {
      sprite.draw(walkAnim(this.lifeTime), ctx, 0, 0, this.vel.x < 0);
    };

    return koopa;
  };
}
