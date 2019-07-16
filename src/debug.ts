import { Camera } from './classes/Camera';
import { Entity } from './classes/Entity';

export function debugTpMouse(
  canvas: HTMLCanvasElement,
  entity: Entity,
  camera: Camera
) {
  let lastEvent: MouseEvent;

  (['mousedown', 'mousemove'] as ['mousedown', 'mousemove']).forEach(eName => {
    canvas.addEventListener(eName, e => {
      if (e.buttons === 1) {
        entity.vel.set(0, 0);
        entity.pos.set(e.offsetX + camera.pos.x, e.offsetY + camera.pos.y);
      } else if (
        e.buttons === 2 &&
        lastEvent &&
        lastEvent.buttons === 2 &&
        lastEvent.type === 'mousemove'
      ) {
        camera.pos.x -= e.offsetX - lastEvent.offsetX;
      }
      lastEvent = e;
    });
  });

  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
  });
}
