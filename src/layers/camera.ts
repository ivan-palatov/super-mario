import { Camera } from '../classes/Camera';
import { Context } from '../common/interfaces';

export function createCameraLayer(cameraToDraw: Camera) {
  return function(ctx: Context, fromCamera: Camera) {
    ctx.strokeStyle = 'pink';
    ctx.beginPath();
    ctx.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y
    );
    ctx.stroke();
  };
}
