
/**
 * Module dependencies.
 */

// commented out by npm-component: var Emitter = require('tower-emitter');
// commented out by npm-component: var content = require('tower-content');
// commented out by npm-component: var directive = require('tower-directive');
// commented out by npm-component: var template = require('tower-template');
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
 * Get an `Element`.
 *
 * @param {String} name The element name.
 * @return {Function} The Element class constructor.
 * @api public
 */

function element(name, parent) {
  if (exports.collection[name])
    return exports.collection[name];

  var prototype = (objectCreate || Object.create)(HTMLElement.prototype);
  prototype.constructor = Element;
  var nativePrototype = HTMLElement.prototype;

  function Element(data, parentScope) {
    // elementDirective
    var el = document.createElement(name);
    for (var key in data) {
      el.setAttribute(key, data[key]);
    }
    template(el)(parentScope);
    return el;
    //return Element.render(el, parent, prototype, parentScope, data);
  }

  for (var key in statics) Element[key] = statics[key];

  // prototype

  Element.prototype = {};
  Element.prototype.constructor = Element;
  
  for (var key in proto) Element.prototype[key] = proto[key];

  // for old browser
  if (!Object.__proto__) {
    if (parent) {
      var obj = document.createElement(parent);
      nativePrototype = Object.getPrototypeOf(obj);
    }
    var proto = prototype;
    while (proto && (proto !== nativePrototype)) {
      proto = proto.__proto__ = Object.getPrototypeOf(proto);
    }
  }

  Element.id = name;
  Element.content = content(name);
  Element.superclasses = [];
  Element.subclasses = [];
  exports.collection[name] = Element;
  exports.collection.push(Element);
  elementDirective(name, parent);
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
    this.superclasses.splice(1, this.superclasses.indexOf(name));
  }

  if (parent.subclasses.hasOwnProperty(this.id)) {
    delete parent.subclasses[this.id];
    parent.subclasses.splice(1, parent.subclasses.indexOf(this.id));
  }

  return this;
};

/**
 * Clear everything (for testing).
 *
 * @chainable
 * @return {Function} exports The main `element` function.
 */

exports.clear = function(){
  exports.off();
  return this;
};

/**
 * Output code for IE.
 */

exports.precompileForIE = function(){
  var code = [];
  for (var i = 0, n = exports.collection.length; i < n; i++) {
    code.push("document.createElement('" + exports.collection[i].id + "')");
  }
  return code.join(';');
};

/**
 * Define `elementDirective`.
 */

function elementDirective(name, parent, prototype) {
  return directive(name, compile).type('element').priority(10000);

  function compile(el) {
    return exec;
    
    function exec(parentScope, cursor, exp, nodeFn, attrs) {
      el = cursor;
      var Element = element(name);
      Element.render(el, parent, prototype, parentScope);

      var scope = el.__scope__;
      var elementAttrs = Element.content.attrs;
      for (var i = 0, n = elementAttrs.length; i < n; i++) {
        watch(elementAttrs[i]);
      }
      Element.emit('render', el);
      return scope;

      function watch(attr) {
        var dynamicName = 'data-' + attr.name;
        scope.edge(attr.name).on('change', function(){
          // XXX: maybe a more generic way
          if (attrs[dynamicName] && attrs[dynamicName].fn) {
            attrs[dynamicName].fn(parentScope, scope.get(attr.name));
          } else {
            el.setAttribute(attr.name, scope.get(attr.name));
          }
        });
      }
    }
  }
}

/**
 * IE8 polyfill?
 */

var objectCreate;
if (typeof Object.create !== 'function') {
  objectCreate = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}