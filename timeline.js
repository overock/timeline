const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const TAG_REGEX = /^<.+>$/;
const SVG_WRAPPER = document.createElementNS(SVG_NAMESPACE, 'svg');
const SVG_CALLER = {
  svg: SVGRoot,
  g: SVGGroup,
  rect: SVGRect,
  circle: SVGCircle,
  line: SVGLine,
  path: SVGPath,
  text: SVGText,
  image: SVGImage
};
const SVG_TAGS = Object.keys(SVG_CALLER);

class SVG {
  constructor(_) {
    let match;
    switch(true) {
      case _ instanceof SVG:
        return _;

      case _ instanceof Array:
      case _ instanceof HTMLCollection:
      case _ instanceof NodeList:
        this.ref = [];

        [].from(_).forEach(v => {
          const 
          caller = c[ _.tagName ];
  
          if(caller) this.ref.push(new caller(_));
          v instanceof SVGElement && this.ref.push(v);
        });
        break;

      // 위임
      case _ instanceof SVGElement:
        return new SVG([ _ ]);
      
      case !!(match = TAG_REGEX.exec(_.trim())):
        SVG_WRAPPER.innerHTML = _;
        return new SVGn(SVG_WRAPPER.children());
      case SVG_TAGS.idexOf(_) != -1:
        
      default:
        return new SVG(document.querySelectorAll(_));
    }

  }

  radius(r) {
    return this.ref.map(v => v.radius && v.radius(r));
  }

  path(d) {

  }
}


class SVGCommon extends SVG {
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