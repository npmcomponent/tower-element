
/**
 * Module dependencies.
 */

var template = require('tower-template');
var domify = require('domify');
var slice = [].slice;

/**
 * Instantiate a new `Element`.
 *
 * @param {Object} Element options.
 * @return {Element} New element instance.
 */

exports.init = function(options){
  return new this(options);
};

/**
 * Add functionality to DSL.
 *
 * @chainable
 * @param {Function} fn Function that is used in the DSL.
 * @return {this} self.
 * @api public
 */

exports.use = function(fn){
  fn.call(this, this);
  return this;
};

/**
 * DOM Element or HTML string.
 *
 * @chainable
 * @param {Mixed} html String or DOM node.
 * @return {this} self.
 */

exports.template = function(html){
  //this.fn = template(this.id, domify(html));
  this.fn = template('string' === typeof html ? domify(html)[0] : html);
  return this;
};

/**
 * Add attribute to content.
 *
 * @chainable
 * @param {String} name Attribute name.
 * @param {String} type Attribute type.
 * @param {Object} options Attribute options.
 * @return {this} self.
 */

exports.attr = function(name, type, options){
  this.content.attr(name, type, options);
  return this;
};

/**
 * Add action to action.
 *
 * @chainable
 * @param {String} name Action name.
 * @param {Function} fn The action function definition.
 * @return {this} self.
 */

exports.action = function(name, fn){
  this.content.action(name, fn);
  return this;
};

/**
 * Define a new DSL method.
 *
 * @chainable
 * @param {String} name DSL method name.
 * @param {Function} fn DSL method function definition.
 * @return {this} self.
 * @api public
 */

exports.method = function(name, fn){
  this[name] = function(){
    fn.apply(this, [this].concat(slice.call(arguments)));
    return this;
  };
  return this;
};