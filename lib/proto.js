
/**
 * Render template against content.
 */

exports.render = function(){
  this.el = this.constructor.fn.clone(this.content);
  return this.el;
};