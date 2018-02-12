class SVG {
  constructor(_) {
    switch(true) {
      case _ instanceof Array:
      case _ instanceof HTMLCollection:
      break;

      case _ instanceof SVG:
        return _;
      case _ instanceof SVGElement:
        const c = {
          svg: SVGRoot,
          g: SVGGroup,
          rect: SVGRect,
          circle: SVGCircle,
          line: SVGLine,
          path: SVGPath,
          text: SVGText,
          image: SVGImage
        },
        caller = _[tagName];

        if(caller) return new caller(_);
        break;
      case typeof _ == 'string':
        let el;
        if(regex = /^<.+>$/.exec(_.trim())) {
          const wrapper = new SVGRoot();
          wrapper.html(_);
          const children = wrapper.children();
          if(child.length==1) {
            el = wrapper.firstElementChild();
          } else {
            el = children;
          }
        } else {
          el = document.createElementNS(this.ns, _);
        }
        return new SVG(el);
      default:
        return new NullSVG();
    }
  }

  static get ns() { return 'http://www.w3.org/2000/svg'; }

  get id() { return this.attr('id'); }
  set id(s) { this.attr('id', s); }

  //get class() { return this.element.classList.join(' '); }
  //set class(s) { }

  get html() { return this.element.innerHTML; }
  set html(m) { this.element.innerHTML = m; }

  attr(k, v) {
    switch(arguments.length) {
      case 1:
        return this.element.getAttribute(k);
      case 2:
        return this.element.setAttribute(k, v);
    }
  }

  style(k, v) {
    switch(arguments.length) {
      case 1:
        return this.element.style[k];
      case 2:
        return this.element.style[k] = v;
    }
  }

  appendTo(e) {
    e && e.appendChild && e.appendChild(this.element);
  }

  append(e) {
    e && this.element.appendChild(e);
  }

  remove() {
    this.element.parentElement && this.element.parentElement.removeChild(this.element);
  }
}

class NullSVG extends SVG {}
class SVGRoot extends SVG {}
class SVGGroup extends SVG {}
class SVGCollection extends SVG {}
class SVGRect extends SVG {}
class SVGCircle extends SVG {}
class SVGLine extends SVG {}
class SVGPath extends SVG {}
class SVGText extends SVG {}
class SVGImage extends SVG {}