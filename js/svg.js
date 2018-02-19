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
      ellipse: SVGEllipse,
      line: SVGLine,
      path: SVGPath,
      text: SVGText,
      image: SVGImage
    }, SVG_TAGS = Object.keys(SVG_CALLER);

    _ || (_ = 'svg');

    if(_ instanceof SVGElement || _ instanceof SVGCommon) {
      _ = [ _ ];
    } /*else if(_ instanceof SVGCommon) { // 비효율적이다 -_-
      _ = [ _.el ];
    } */else if(typeof _ == 'string') {
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
      if(v instanceof SVGCommon) {
        this.collection.push(v);
      } else {
        const caller = SVG_CALLER[v.tagName];
        caller && this.collection.push(new caller(v));
      }
    });
  }

  append(c) {
    const parent = this.collection.find(v => v.appendable);
    return parent && parent.append(new SVG(c));
  }

  appendTo(p) {
    if(p instanceof SVG) p = p.collection[0].el;
    this.collection.forEach(v => p.appendChild(v.el));
    return this;
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
  get elements() { return this.collection.map(v => v.el); }

  css(k, ...v) { return this.iter('css', ...v); }
  attr(k, ...v) { return this.iter('attr', ...v); }

  classList() {
    // 교집합만 내보내자.
    //return this.collection.reduce()
  }
  addClass(s) { return this.collection.forEach(v => v.el.addClass(s)), this; }
  removeClass(s) { return this.collection.forEach(v => v.removeClass(s)), this; }

  on(type, fn) { this.collection.forEach(v => v.addEventListener(type, fn)); }
  off(type, fn) { this.collection.forEach(v => v.removeEventListener(type, fn)); }

  id(...s) { return this.iter('id', ...s); }
  html(...s) { return this.iter('html', ...s); }

  stroke(...s) { return this.iter('stroke', ...s); }
  weight(...n) { return this.iter('weight', ...n); }
  dasharray(...n) { return this.iter('dasharray', n.join(' ') || undefined); }
  linejoin(...s) { return this.iter('linejoin', ...s); }
  linecap(...s) { return this.iter('linecap', ...s); }
  fill(...s) { return this.iter('fill', ...s); }
  
  x(...n) { return this.iter('x', ...n); }
  y(...n) { return this.iter('y', ...n); }
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

  stroke(s) { return this.css('stroke', s); }
  weight(n) { return this.css('stroke-width', n); }
  dasharray(s) { return this.css('stroke-dasharray', s); }
  linejoin(s) { return this.attr('stroke-linejoin', s); }
  linecap(s) { return this.attr('stroke-linecap', s); }
  fill(s) { return this.css('fill', s); }

  appendTo(e) {
    if(e instanceof SVGCommon) e = e.el;
    e && e.appendChild && e.appendChild(this.el);
    return this;
  }

  append(e) {
    if(e instanceof SVGCommon) e = e.el;
    e && this.el.appendChild(e);
    return this;
  }

  remove() {
    this.el.parentElement && this.el.parentElement.removeChild(this.el);
    return this;
  }
}

class SVGRoot extends SVGCommon {
  constructor(el) {
    super(el);
    this.appendable = true;
  }
  width(n) { return this.css('width', n); }
  height(n) { return this.css('height', n); }
}
class SVGGroup extends SVGCommon {
  constructor(el) {
    super(el);
    this.appendable = true;
  }
}

class SVGRect extends SVGCommon {
  width(n) { return this.attr('width', n); }
  height(n) { return this.attr('height', n); }
  x(n) { return this.attr('x', n); }
  y(n) { return this.attr('y', n); }
  radius(n) { return this.attr('rx', n), this.attr('ry', n); }
}

class SVGCircle extends SVGCommon {
  x(n) { return this.attr('cx', n); }
  y(n) { return this.attr('cy', n); }
  radius(n) { return this.attr('r', n); }
}

class SVGEllipse extends SVGCommon {
  x(n) { return this.attr('cx', n); }
  y(n) { return this.attr('cy', n); }
  radius(n) { return this.attr('rx', n), this.attr('ry', n); }
  width(n) { return typeof n == 'undefined'? (this.attr('rx')|0)*2 : this.attr('rx', n/2); }
  height(n) { return typeof n == 'undefined'? (this.attr('ry')|0)*2 : this.attr('ry', n/2); }
}

class SVGLine extends SVGCommon {
  x(n) { return this.attr('x1', n); }
  y(n) { return this.attr('y1', n); }
  width(n) {
    const x = this.attr('x1')|0;
    return typeof n == 'undefined'? (this.attr('x2')|0) - x : this.attr('x2', n + x);
  }
  height(n) {
    const y = this.attr('y1')|0
    return typeof n == 'undefined'? (this.attr('y2')|0) - y : this.attr('y2', n + y);
  }
}

class SVGPath extends SVGCommon {}
class SVGText extends SVGCommon {}
class SVGImage extends SVGCommon {}