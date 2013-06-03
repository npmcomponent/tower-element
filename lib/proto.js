
/**
 * Render template against content.
 */

exports.render = function(){
  this.remove();
  this.el = this.constructor.fn.clone(this.content);
  return this.el;
};

exports.remove = function(){
  if (this.el) {
    // XXX
  }

  return this;
};