
/**
 * Module dependencies.
 */

var template = require('tower-template');
var domify = require('domify');
var slice = [].slice;

/**
 * Instantiate a new `Element`.
 */

exports.init = function(options){
  return new this(options);
};

/**
 * Add functionality to DSL.
 */

exports.use = function(fn){
  fn.call(this, this);
  return this;
}

/**
 * DOM Element or HTML string.
 *
 * @param {Mixed} html String or DOM node.
 */

exports.template = function(html){
  //this.fn = template(this.id, domify(html));
  this.fn = template('string' === typeof html ? domify(html)[0] : html);
  return this;
};

exports.attr = function(name, type, options){
  this.content.attr(name, type, options);
  return this;
};

exports.action = function(name, fn){
  this.content.action(name, fn);
  return this;
};

/**
 * Define a new DSL method.
 *
 * @param {String} name
 * @param {Function} fn
 * @return this
 * @api public
 */

exports.method = function(name, fn){
  this[name] = function(){
    fn.apply(this, [this].concat(slice.call(arguments)));
    return this;
  };
  return this;
};