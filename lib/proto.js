
/**
 * Render template against content.
 *
 * @constructor Element
 * @return {Content} The current element's content.
 */

exports.render = function(){
  this.remove();
  this.el = this.constructor.fn.clone(this.content);
  return this.el;
};

/**
 * Remove the element.
 *
 * @constructor Element
 * @chainable
 * @return {Element}
 */

exports.remove = function(){
  if (this.el && this.el.parentNode) {
    this.el.parentNode.removeChild(this.el);
  }
  this.el = undefined;

  return this;
};