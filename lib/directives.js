
/**
 * Module dependencies.
 */

var directive = require('tower-directive');

/**
 * Define `data-element` directive.
 */

directive('data-element', function(scope, el, exp){
  var val = exp.val;
  var obj = element(val).init();
  el.appendChild(obj.render(scope));
});