const PRESSED = 1;
const RELEASED = 0;

const events: ['keydown', 'keyup'] = ['keydown', 'keyup'];

export class Keyboard {
  keyStates = new Map<number, number>();
  keyMap = new Map<number, (arg: number) => void>();

  addMapping(keycode: number, callback: (keyState: number) => void) {
    this.keyMap.set(keycode, callback);
  }

  handleEvent(e: KeyboardEvent) {
    const { keyCode } = e;
    if (!this.keyMap.has(keyCode)) {
      return;
    }
    e.preventDefault();
    const keyState = e.type === 'keydown' ? PRESSED : RELEASED;
    if (this.keyStates.get(keyCode) === keyState) {
      return;
    }
    this.keyStates.set(keyCode, keyState);
    console.log(this.keyStates);

    this.keyMap.get(keyCode)!(keyState);
  }

  listenTo(window: Window) {
    events.forEach(eventName => {
      window.addEventListener(eventName, e => {
        this.handleEvent(e);
      });
    });
  }
}
