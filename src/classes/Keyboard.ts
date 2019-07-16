const PRESSED = 1;
const RELEASED = 0;

const events: ['keydown', 'keyup'] = ['keydown', 'keyup'];

export class Keyboard {
  keyStates = new Map<string, number>();
  keyMap = new Map<string, (arg: number) => void>();

  addMapping(code: string, callback: (keyState: number) => void) {
    this.keyMap.set(code, callback);
  }

  handleEvent(e: KeyboardEvent) {
    const { code } = e;
    if (!this.keyMap.has(code)) {
      return;
    }
    e.preventDefault();
    const keyState = e.type === 'keydown' ? PRESSED : RELEASED;
    if (this.keyStates.get(code) === keyState) {
      return;
    }
    this.keyStates.set(code, keyState);
    this.keyMap.get(code)!(keyState);
  }

  listenTo(window: Window) {
    events.forEach(eventName => {
      window.addEventListener(eventName, e => {
        this.handleEvent(e);
      });
    });
  }
}
