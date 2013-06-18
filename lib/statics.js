
/**
 * Module dependencies.
 */

var template = require('tower-template');
var domify = require('domify');
var slice = [].slice;

/**
 * Instantiate a new `Element`.
 *
 * @constructor Element
 * @param {Object} Element options.
 * @return {Element} New element instance.
 * @api public
 */

exports.init = function(options){
  return new this(options);
};

/**
 * Add functionality to DSL.
 *
 * @constructor Element
 * @chainable
 * @param {Function} fn Function that is used in the DSL.
 * @return {Function} exports The main `element` function.
 * @api public
 */

exports.use = function(fn){
  fn.call(this, this);
  return this;
};

/**
 * DOM Element or HTML string.
 *
 * @constructor Element
 * @chainable
 * @param {Mixed} html String or DOM node.
 * @return {Function} exports The main `element` function.
 * @api public
 */

exports.template = function(html){
  //this.fn = template(this.id, domify(html));
  this.fn = template('string' === typeof html ? domify(html)[0] : html);
  return this;
};

/**
 * Add attribute to content.
 *
 * @constructor Element
 * @chainable
 * @param {String} name Attribute name.
 * @param {String} type Attribute type.
 * @param {Object} options Attribute options.
 * @return {Function} exports The main `element` function.
 * @api public
 */

exports.attr = function(name, type, options){
  this.content.attr(name, type, options);
  return this;
};

/**
 * Add action to content.
 *
 * @constructor Element
 * @chainable
 * @param {String} name Action name.
 * @param {Function} fn The action function definition.
 * @return {Function} exports The main `element` function.
 * @api public
 */

exports.action = function(name, fn){
  this.content.action(name, fn);
  return this;
};

/**
 * Add helper to content.
 *
 * Helpers are used mainly for dynamically generating values,
 * while actions are used for user actions.
 *
 * @constructor Element
 * @chainable
 * @param {String} name Helper name.
 * @param {Function} fn The helper function definition.
 * @return {Function} exports The main `element` function.
 * @api public
 */

exports.helper = function(name, fn){
  this.content.helper(name, fn);
  return this;
};

/**
 * Define a new DSL method.
 *
 * @constructor Element
 * @chainable
 * @param {String} name DSL method name.
 * @param {Function} fn DSL method function definition.
 * @return {Function} exports The main `element` function.
 * @api public
 */

exports.method = function(name, fn){
  this[name] = function(){
    fn.apply(this, [this].concat(slice.call(arguments)));
    return this;
  };
  return this;
};