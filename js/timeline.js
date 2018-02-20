import { SVG } from './svg.js';

class Timeline {
  constructor() {
    this.renderer = new SVG().width('100%').height('100%');
    this._data = null;
  }

  set data(d) {
    this._data = new Proxy(d, {
      set: (obj, prop, value) => {
        obj[prop] = value;
        this.render();
      },

      deleteProperty: (obj, prop) => {
        delete obj[prop];
        this.render();
      }
    });

    this.render();
  }
  get data() { return this._data; }

  render() {
    // axis 분석(변량)
    // 눈금 세팅 (초, 분, 시, 일)
    // 적절히 그리기
  }

  append(el) {
    el.appendChild(this.renderer.elements[0]);
  }
}

export { Timeline };