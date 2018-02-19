class Timeline {
  constructor() {
    this.renderer = new SVG().width('100%').height('100%');
    this._data = null;
  }

  set data(d) { this._data = d; }
  get data() { return this._data; }

  render() {

  }

  append(el) {
    console.log(el, this.renderer);
    el.appendChild(this.renderer.elements[0]);
  }
}