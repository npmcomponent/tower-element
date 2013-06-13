
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var content = require('tower-content');
var proto = require('./lib/proto');
var statics = require('./lib/statics');
require('./lib/directives');

/**
 * Expose `element`.
 */

exports = module.exports = element;

/**
 * Expose `collection`.
 */

exports.collection = [];

/**
 * Get an `Element`.
 *
 * @param {String} name The element name.
 * @return {Function} The Element class constructor.
 * @api public
 */

function element(name) {
  if (exports.collection[name])
    return exports.collection[name];

  function Element(options) {
    this.name = name;
    this.content = this.constructor.content.init(options);
  }

  for (var key in statics) Element[key] = statics[key];

  // prototype

  Element.prototype = {};
  Element.prototype.constructor = Element;
  
  for (var key in proto) Element.prototype[key] = proto[key];

  Element.id = name;
  Element.content = content(name);
  Element.superclasses = [];
  Element.subclasses = [];
  exports.collection[name] = Element;
  exports.collection.push(Element);
  exports.emit('define', Element);
  exports.emit('define ' + name, Element);
  return Element;
}

/**
 * Mixin `Emitter`.
 */

Emitter(element);
Emitter(statics);
Emitter(proto);

/**
 * Add parent class props/fns.
 *
 * @chainable
 * @param {String} name Property/function name.
 * @return {Element} The element class constructor.
 * @api public
 */

statics.inherit = function(name){
  var parent = exports(name);

  if (this.superclasses.hasOwnProperty(name))
    return this;

  this.superclasses[name] = true;
  this.superclasses.push(name);

  if (!parent.subclasses.hasOwnProperty(this.id)) {
    parent.subclasses[this.id] = true;
    parent.subclasses.push(this.id);
  }

  for (var i = 0, n = parent.content.attrs.length; i < n; i++) {
    // XXX: should just have to be like this:
    // this.attr(parent.attrs[i]);
    var attr = parent.content.attrs[i];
    this.attr(attr.name, attr.type, attr);
  }

  return this;
};

/**
 * Remove parent class props/fns.
 *
 * @chainable
 * @param {String} name Property/function name.
 * @return {Element} The element class constructor.
 * @api public
 */

statics.disinherit = function(name){
  var parent = exports(name);

  if (this.superclasses.hasOwnProperty(name)) {
    delete this.superclasses[name];
    this.superclasses.splice(1, this.superclasses.indexOf((name));
  }

  if (parent.subclasses.hasOwnProperty(this.id)) {
    delete parent.subclasses[this.id];
    parent.subclasses.splice(1, parent.subclasses.indexOf((this.id));
  }

  return this;
};

/**
 * Clear everything (for testing).
 *
 * @return {this} self.
 */

exports.clear = function(){
  exports.off();
  return this;
};