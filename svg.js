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

    this.collection = [];

    Array.from(_).forEach(v => {
      const caller = SVG_CALLER[v.tagName];

      caller && this.collection.push(new caller(v));
    });
  }

  append(c) {
    const parent = this.collection.find(v => v.appendable);
    return parent && parent.append(new SVG(c));
  }

  appendTo(p) {
    const parent = new SVG(p);
    return parent.appendable && parent.append(this);
  }

  remove() { return this.collection.map(v => v.remove()); }

  iter(f, ...a) {
    if(a.length) {
      return this.collection.map(v => v[f] && v[f](...a)), this;
    } else {
      const found = this.collection.find(v => v[f]);
      return found && found[f]();
    }
  }

  item(n) { return new SVG(this.collection[n]); }

  css(k, ...v) { return this.iter('css', ...v); }
  attr(k, ...v) { return this.iter('attr', ...v); }

  id(...s) { return this.iter('id', ...s); }
  html(...s) { return this.iter('html', ...s); }

  strokecolor(...s) { return this.iter('strokecolor', ...s); }
  strokeweight(...n) { return this.iter('strokeweight', ...n); }
  dasharray(...n) { return this.iter('dasharray', n.join(' ') || undefined); }
  linejoin(...s) { return this.iter('linejoin', ...s); }
  linecap(...s) { return this.iter('linecap', ...s); }
  fill(...s) { return this.iter('fill', ...s); }
  
  left(...n) { return this.iter('left', ...n); }
  top(...n) { return this.iter('top', ...n); }
  width(...n) { return this.iter('width', ...n); }
  height(...n) { return this.iter('height', ...n); }
  radius(...n) { return this.iter('radius', ...n); }

}


class SVGCommon {
  constructor(el) {
    this.el = el;
  }

  attr(k, v) {
    return typeof v == 'undefined'? this.el.getAttribute(k) : (this.el.setAttribute(k, v), this);
  }

  css(k, v) {
    return typeof v == 'unefined'? this.el.style[k] : ((this.el.style[k] = v), this);
  }

  id(s) { return this.attr('id'); }
  html(s) { return typeof s == 'undefined'? this.el.innerHTML : ((this.el.innerHTML = s), this); }

  strokecolor(s) { return this.css('stroke', s); }
  strokeweight(n) { return this.css('stroke-width', n); }
  dasharray(s) { return this.css('stroke-dasharray', s); }
  linejoin(s) { return this.attr('stroke-linejoin', s); }
  linecap(s) { return this.attr('stroke-linecap', s); }
  fill(s) { return this.css('fill', s); }

  appendTo(e) {
    if(e instanceof SVG) e = e.el;
    e && e.appendChild && e.appendChild(this.el);
    return this;
  }

  append(e) {
    if(e instanceof SVG) e = e.el;
    e && this.el.appendChild(e);
    return this;
  }

  remove() {
    this.el.parentElement && this.el.parentElement.removeChild(this.el);
    return this;
  }
}

class SVGRoot extends SVGCommon {
  constructor() {
    this.appendable = true;
  }
  width(n) { return this.css('width', n); }
  height(n) { return this.css('height', n); }
}
class SVGGroup extends SVGCommon {
  constructor() {
    super();
    this.appendable = true;
  //   this.stroke = null;
  //   this.strokeWidth = null;
  //   this.lineCap = null;
  //   this.lineJoin = null;
  //   this.fill = null;
  }
}

class SVGRect extends SVGCommon {
  width(n) { return this.attr('width', n); }
  height(n) { return this.attr('height', n); }
  left(n) { return this.attr('x', n); }
  top(n) { return this.attr('y', n); }
  radius(n) { return this.attr('rx', n), this.attr('ry', n); }
}
class SVGCircle extends SVGCommon {
  left(n) { return this.attr('cx', n); }
  top(n) { return this.attr('cy', n); }
  radius(n) { return this.attr('r', n); }
}

class SVGLine extends SVGCommon {
  left(n) { return this.attr('x1', n); }
  top(n) { return this.attr('y1', n); }
  width(n) { return this.attr('x2', n); }
  height(n) { return this.attr('y2', n); }
}
class SVGPath extends SVGCommon {}
class SVGText extends SVGCommon {}
class SVGImage extends SVGCommon {}