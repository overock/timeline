const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const TAG_REGEX = /^<.+>$/;
const SVG_WRAPPER = document.createElementNS(SVG_NAMESPACE, 'svg');

class SVG {
  constructor(_) {
    if(_ instanceof SVG) return _;

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

    if(_ instanceof SVGElement) {
      _ = [ _ ];
    } else if(typeof _ == 'string') {
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

  append(c) {
    const parent = this.el.find(v => v.appendable);
    return parent && parent.append(new SVG(c));
  }

  appendTo(p) {
    const parent = new SVG(p);
    return parent.appendable && parent.append(this);
  }

  _get(f) {    
    const found = this.el.find(v => v[f]);
    return found && found[f]();
  }
  _set(f, ...a) { this.el.map(v => v[f] && v[f](...a)); }

  css(k, v) { return this._set('css', k, v); }
  attr(k, v) { return this._set('attr', k, v); }

  get left() { return this._get('left'); }
  set left(l) { this._set('left', l); }
  get top() { return this._get('top'); }
  set top(l) { this._set('top', l); }
  get width() { return this._get('width'); }
  set width(l) { this._set('width', l); }
  get height() { return this._get('height'); }
  set height(l) { this._set('height', l); }

  get radius() { return this._get('radius'); }
  set radius(r) { this._set('radius', r); }
  get path() { return this._get('path'); }
  set path(d) { this._set('path', d); }

  item(n) { return new SVG(this.el[n]); }
}


class SVGCommon {
  constructor(el) {
    this.el = el;
  }

  attr(k, v) {
    return typeof v == 'undefined'? this.el.getAttribute(k) : this.el.setAttribute(k, v);
  }

  css(k, v) {
    return typeof v == 'unefined'? this.el.style[k] : (this.el.style[k] = v);
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

class SVGRoot extends SVGCommon {
  width(l) { return this.attr('width', l); }
}
class SVGGroup extends SVGCommon {}

class SVGRect extends SVGCommon {}
class SVGCircle extends SVGCommon {}
class SVGLine extends SVGCommon {}
class SVGPath extends SVGCommon {}
class SVGText extends SVGCommon {}
class SVGImage extends SVGCommon {}