
/**
 * Module dependencies.
 */

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
  }

  Element.prototype = {};
  Element.prototype.constructor = Element;

  Element.id = name;
  exports.collection[name] = Element;
  exports.collection.push(Element);
  return Element;
}