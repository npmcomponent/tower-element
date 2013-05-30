
/**
 * Module dependencies.
 */

var template = require('tower-template');

/**
 * DOM Element or HTML string.
 *
 * @param {Mixed} html String or DOM node.
 */

exports.template = function(html){
  this.fn = template(html);
  return this;
}

exports.attr = function(){
  return this;
}

exports.action = function(){
  return this;
}