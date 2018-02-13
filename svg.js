const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const TAG_REGEX = /^<.+>$/;
const SVG_WRAPPER = document.createElementNS(SVG_NAMESPACE, 'svg');

class SVG {
  constructor(_) {
    const SVG_CALLER = {
      svg: SVGRoot,
      g: SVGGroup,
      rect: SVGRect,
      circle: SVGCircle,
      line: SVGLine,
      path: SVGPath,
      text: SVGText,
      image: SVGImage
    }, SVG_TAGS = Object.keys(SVG_CALLER);
    
    if(_ instanceof SVG) return _;

    if(_ instanceof SVGElement) _ = [ _ ];

    if(typeof _ == 'string') {
      if(TAG_REGEX.exec(_.trim())) {  // markup form
        SVG_WRAPPER.innerHTML = _;
        _ = SVG_WRAPPER.children();
      } else if(SVG_TAGS.indexOf(_) != -1) {  // tag form
        _ = [ document.createElementNS(SVG_NAMESPACE, _) ];
      } else {
        _ = document.querySelectorAll(_);
      }
    }

    this.el = [];

    Array.from(_).forEach(v => {
      const caller = SVG_CALLER[v.tagName];

      caller && this.el.push(new caller(v));
    });
  }

  _get(f) {
    const found = this.el.find(v => v[_f]);
    return found && found[_f];
  }
  _set(f, ...v) { this.el.map(v => v[_f] && (v[f] = v)); }

  get width() { return this.iterate('width'); }
  set width(l) { this._set('width', l); }
  get height() { return this.iterate('height'); }
  set height(l) { this._set('height', l); }

  set radius(r) { this._set('radius', r); }
  set path(d) { this._set('path', d); }
}


class SVGCommon {
  constructor(el) {
    this.el = el;
  }

  attr(k, v) {
    switch(arguments.length) {
      case 1:
        return this.el.getAttribute(k);
      case 2:
        return this.el.setAttribute(k, v);
    }
  }

  style(k, v) {
    switch(arguments.length) {
      case 1:
        return this.el.style[k];
      case 2:
        return this.el.style[k] = v;
    }
  }

  get id() { return this.attr('id'); }
  set id(s) { this.attr('id', s); }

  //get class() { return this.element.classList.join(' '); }
  //set class(s) { }

  get html() { return this.el.innerHTML; }
  set html(m) { this.el.innerHTML = m; }

  

  appendTo(e) {
    e && e.appendChild && e.appendChild(this.el);
  }

  append(e) {
    e && this.el.appendChild(e);
  }

  remove() {
    this.el.parentElement && this.el.parentElement.removeChild(this.el);
  }
}

class SVGRoot extends SVGCommon {}
class SVGGroup extends SVGCommon {}

class SVGRect extends SVGCommon {}
class SVGCircle extends SVGCommon {}
class SVGLine extends SVGCommon {}
class SVGPath extends SVGCommon {}
class SVGText extends SVGCommon {}
class SVGImage extends SVGCommon {}