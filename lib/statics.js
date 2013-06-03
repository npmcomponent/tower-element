
/**
 * Module dependencies.
 */

var template = require('tower-template');
var slice = [].slice;

/**
 * Instantiate a new `Element`.
 */

exports.init = function(options){
  return new this(options);
};

/**
 * DOM Element or HTML string.
 *
 * @param {Mixed} html String or DOM node.
 */

exports.template = function(html){
  this.fn = template(html);
  return this;
};

exports.attr = function(){
  return this;
};

exports.action = function(){
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