
/**
 * Render template against content.
 *
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
 * @chainable
 * @return {Element} The element instance.
 */

exports.remove = function(){
  if (this.el && this.el.parentNode) {
    this.el.parentNode.removeChild(this.el);
  }
  this.el = undefined;

  return this;
};