
/**
 * Render template against content.
 *
 * @constructor Element
 * @return {Content} The current element's content.
 */

exports.render = function(){
  this.detach();
  if (!this.constructor.el) return;
  if (this.el)
    this.el = this.constructor.fn(this.content, this.el);
  else
    this.el = this.constructor.fn(this.content, this.constructor.el.cloneNode(true));
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
  this.detach();
  // this.el = undefined;

  return this;
};

/**
 * Detach the element.
 *
 * @constructor Element
 * @chainable
 * @return {Element}
 */

exports.detach = function(){
  if (this.el && this.el.parentNode) {
    this.el.parentNode.removeChild(this.el);
  }

  return this;
};

/**
 * Get attr. Delegates to `content`.
 *
 * @param {String} name
 */

exports.get = function(name){
  return this.content.get(name);
};

/**
 * Set attr. Delegates to `content`.
 *
 * @param {String} name
 * @param {Mixed} val
 */

exports.set = function(name, val){
  return this.content.set(name, val);
};