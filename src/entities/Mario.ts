import { Entity } from '../classes/Entity';
import { SpriteSheet } from '../classes/SpriteSheet';
import { Jump } from '../classes/traits/Jump';
import { Killable } from '../classes/traits/Killable';
import { PlayerController } from '../classes/traits/PlayerController';
import { Stomper } from '../classes/traits/Stomper';
import { Walk } from '../classes/traits/Walk';
import { Context } from '../common/interfaces';
import { loadSpriteSheet } from '../loaders';

export const SLOW_DRAG = 1 / 1000;
const FAST_DRAG = 1 / 5000;

export async function loadMario() {
  const sprite = await loadSpriteSheet('mario');
  return createMarioFactory(sprite);
}

function createPlayerController(entity: Entity) {
  const controller = new PlayerController();
  controller.player = entity;
  controller.checkPoint.set(64, 64);
  return controller;
}

function createMarioFactory(sprite: SpriteSheet) {
  const runAnim = sprite.animations.get('run')!;

  function routeFrame(entity: Entity) {
    if (entity.jump.falling) {
      return 'jump';
    }
    if (entity.walk.distance > 0) {
      if (
        (entity.vel.x > 0 && entity.walk.direction < 0) ||
        (entity.vel.x < 0 && entity.walk.direction > 0)
      ) {
        return 'break';
      }
      return runAnim(entity.walk.distance);
    }
    return 'idle';
  }

  function turboMode(this: Entity, turboOn: number | boolean) {
    this.walk.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
  }

  function drawMario(this: Entity, ctx: Context) {
    sprite.draw(routeFrame(this), ctx, 0, 0, this.walk.heading < 0);
  }

  return function() {
    const mario = new Entity();
    mario.size.set(14, 16);

    mario.addTrait(new Walk());
    mario.addTrait(new Jump());
    mario.addTrait(new Killable());
    mario.addTrait(new Stomper());
    mario.addTrait(createPlayerController(mario));

    mario.killable.removeAfter = 0;

    mario.turbo = turboMode;
    mario.draw = drawMario;

    mario.turbo(false);

    return mario;
  };
}
