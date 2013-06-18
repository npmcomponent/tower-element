
/**
 * Module dependencies.
 */

var directive = require('tower-directive');

/**
 * Expose `elementDirective`.
 */

module.exports = elementDirective;

/**
 * Define `data-element` directive.
 */

function elementDirective(element) {
  directive('data-element', function(scope, el, attr){
    // XXX: make into better expression parser
    var val = attr.value.match(/\(/)
      ? attr.expression(scope)
      : attr.value;

    var obj = element(val).init();
    el.appendChild(obj.render(scope));
  }); 
}