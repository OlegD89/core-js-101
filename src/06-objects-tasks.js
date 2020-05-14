/* eslint-disable no-fallthrough */
/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() { return (this.width * this.height); },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class BildSelector {
  checkValuesBefore(el) {
    // element, id, class, attribute, pseudo-class, pseudo-element
    switch (el) {
      case 'element':
        if (this.idValue) return false;
      case 'id':
        if (this.classValue) return false;
      case 'class':
        if (this.attrValue) return false;
      case 'attr':
        if (this.pseudoClassValue) return false;
      case 'pseudoClass':
        if (this.pseudoElementValue) return false;
      default:
        break;
    }
    return true;
  }

  checkingOrder(el) {
    if (!this.checkValuesBefore(el)) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }
  }

  element(value) {
    if (this.elementValue) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    this.checkingOrder('element');
    this.elementValue = value;
    return this;
  }

  id(value) {
    if (this.idValue) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    this.checkingOrder('id');
    this.idValue = `#${value}`;
    return this;
  }

  class(value) {
    this.checkingOrder('class');
    this.classValue = !this.classValue ? `.${value}` : `${this.classValue}.${value}`;
    return this;
  }

  attr(value) {
    this.checkingOrder('attr');
    this.attrValue = `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.checkingOrder('pseudoClass');
    this.pseudoClassValue = !this.pseudoClassValue ? `:${value}` : `${this.pseudoClassValue}:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.checkingOrder('pseudoElement');
    if (this.pseudoElementValue) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
    this.pseudoElementValue = `::${value}`;
    return this;
  }

  stringify() {
    let result = '';
    if (this.elementValue) result += this.elementValue;
    if (this.idValue) result += this.idValue;
    if (this.classValue) result += this.classValue;
    if (this.attrValue) result += this.attrValue;
    if (this.pseudoClassValue) result += this.pseudoClassValue;
    if (this.pseudoElementValue) result += this.pseudoElementValue;
    return result;
  }
}


const cssSelectorBuilder = {
  selector: '',

  element(value) {
    const selector = new BildSelector();
    selector.element(value);
    return selector;
  },

  id(value) {
    const selector = new BildSelector();
    selector.id(value);
    return selector;
  },

  class(value) {
    const selector = new BildSelector();
    selector.class(value);
    return selector;
  },

  attr(value) {
    const selector = new BildSelector();
    selector.attr(value);
    return selector;
  },

  pseudoClass(value) {
    const selector = new BildSelector();
    selector.pseudoClass(value);
    return selector;
  },

  pseudoElement(value) {
    const selector = new BildSelector();
    selector.pseudoElement(value);
    return selector;
  },

  combine(selector1, combinator, selector2) {
    this.selector = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  },

  stringify() {
    return this.selector;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
