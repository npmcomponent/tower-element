
/**
 * Module dependencies.
 */

var template = require('tower-template');
var attr = require('tower-attr-directive');
var domify = require('domify');
var slice = [].slice;
var setAttribute = HTMLElement.prototype.setAttribute;
var nativePrototype = HTMLElement.prototype;
var document = 'undefined' === typeof window
  ? require('tower-server-dom')().document
  : window.document;

/**
 * Instantiate a new `Element`.
 *
 * @constructor Element
 * @param {Object} data Element attrs.
 * @param {Object} parent Parent scope.
 * @return {Element} New element instance.
 * @api public
 */

exports.init = function(data, parent){
  return new this(data, parent);
};

/**
 * Apply advanced stuff to the plain dom `el`.
 */

exports.render = function(el, parent, prototype){
  var scope = this.content.init();
  el.__scope__ = scope;

  // XXX: template
  if (this.el) {
    // XXX: needs to be merged better
    // el -> scope: set the initial values.
    var attrs = this.content.attrs;
    for (var i = 0, n = attrs.length; i < n; i++) {
      if (el.hasAttribute(attrs[i].name))
        scope.set(attrs[i].name, el.getAttribute(attrs[i].name));
    }

    // scope -> el: set the initial values.
    var data = scope.data;
    for (var key in data) {
      if (!el.hasAttribute(key)) el.setAttribute(key, data[key]);
    }

    // XXX: replace
    var templateEl = this.fn(el.__scope__, this.el.cloneNode(true));
    el.appendChild(templateEl);

    for (var i = 0, n = el.childNodes.length; i < n; i++) {
      el.childNodes[i].__scope__ = el.__scope__;
    }
  }

  // some definitions specify an 'is' attribute
  if (parent) el.setAttribute('is', parent);

  // if we can easily extend the prototype...
  if (Object.__proto__) {
    el.__proto__ = prototype;
  } else {
    var used = {};
    var p = prototype;
    while (p !== nativePrototype && p !== HTMLUnknownElement.prototype) {
      var keys = Object.getOwnPropertyNames(p);
      for (var i = 0, k; k = keys[i]; i++) {
        if (!used[k]) {
          Object.defineProperty(el, k, Object.getOwnPropertyDescriptor(p, k));
          used[k] = 1;
        }
      }
      p = Object.getPrototypeOf(p);
    }

    el.__proto__ = prototype;
  }
  
  el.setAttribute = function(name, val){
    setAttribute.call(el, name, val);
    scope.set(name, val);
    return val;
  };

  this.emit('init', el);

  return el;
};

/**
 * Render template.
 */

exports.initChildren = function(){
  if (this.el) {
    var el = this.el.cloneNode(true);
    el.__scope__ = this.content.init();
    return el; 
  }
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

exports.template = function(html, replace){
  //this.fn = template(this.id, domify(html));
  this.el = 'string' === typeof html ? domify(html, document) : html;
  // XXX: override cloneNode
  this.fn = template(this.el);
  this.replace = !!replace;
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
  // XXX: maybe a way to scope to this element?
  attr(name);
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

/**
 * Define custom events.
 */

exports.event = function(name){

};