
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var content = require('tower-content');
var proto = require('./lib/proto');
var statics = require('./lib/statics');

/**
 * Expose `element`.
 */

exports = module.exports = element;

/**
 * Expose `collection`.
 */

exports.collection = [];

/**
 * A one-liner.
 *
 * @param {String} name
 * @return {Function}
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
 * Clear everything (for testing).
 */

exports.clear = function(){
  exports.off();
  return this;
}