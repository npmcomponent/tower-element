
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter');
var content = require('tower-content');
var directive = require('tower-directive');
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

  var prototype = Object.create(HTMLElement.prototype);
  prototype.constructor = Element;
  var nativePrototype = HTMLElement.prototype;

  function Element(data, parent) {
    // elementDirective

    var el = document.createElement(name);
    el.__scope__ = Element.content.init();

    // some definitions specify an 'is' attribute
    if (parent) el.setAttribute('is', parent);

    // prototype swizzling is best
    if (Object.__proto__) {
      el.__proto__ = prototype;
    } else {
      // TODO(sjmiles): 'used' allows us to only copy the 'youngest' version of
      // any property. This set should be precalculated. We also need to
      // consider this for supporting 'super'.
      var used = {};
      // start with inSrc
      var p = prototype;
      // sometimes the default is HTMLUnknownElement.prototype instead of
      // HTMLElement.prototype, so we add a test
      // the idea is to avoid mixing in native prototypes, so adding
      // the second test is WLOG
      while (p !== nativePrototype && p !== HTMLUnknownElement.prototype) {
        var keys = Object.getOwnPropertyNames(p);
        for (var i=0, k; k=keys[i]; i++) {
          if (!used[k]) {
            Object.defineProperty(el, k, Object.getOwnPropertyDescriptor(p, k));
            used[k] = 1;
          }
        }
        p = Object.getPrototypeOf(p);
      }

      el.__proto__ = prototype;
    }

    Element.emit('init', el);

    return el;
  }

  if (!Object.__proto__) {
    if (parent) {
      var obj = document.createElement(name);
      nativePrototype = Object.getPrototypeOf(obj);
    }
    var proto = prototype, ancestor;
    while (proto && (proto !== nativePrototype)) {
      var ancestor = Object.getPrototypeOf(proto);
      proto.__proto__ = ancestor;
      proto = ancestor;
    }
  }

  for (var key in statics) Element[key] = statics[key];

  // prototype

  Element.prototype = {};
  Element.prototype.constructor = Element;
  
  for (var key in proto) Element.prototype[key] = proto[key];

  Element.id = name;
  Element.content = content(name);
  // XXX: not sure if this should be done, but it simplifies
  // the api if you want to use the attrs on the element.
  Element.attrs = Element.content.attrs;
  Element.superclasses = [];
  Element.subclasses = [];
  exports.collection[name] = Element;
  exports.collection.push(Element);
  elementDirective(name);
  exports.emit('define', Element);
  exports.emit('define ' + name, Element);
  return Element;
}

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

function elementDirective(name) {
  return directive(name, exec).types({ element: true });

  function exec(parentScope, el, exp, nodeFn, attrs) {
    //if (el.__skip__) return;

    var Element = element(name);
    var children = Element.initChildren();
    //for (var i = 0, n = el.attributes.length; i < n; i++) {
    //  customEl.setAttribute(el.attributes[i].name, el.attributes[i].value);
    //}
    Element.emit('init', el);

    if (children) {
      var scope = children.__scope__;
      var elementAttrs = Element.content.attrs;
      for (var i = 0, n = elementAttrs.length; i < n; i++) {
        watch(elementAttrs[i]);
      }
      // XXX: <content>
      el.appendChild(children); 
    }

    /*
    // the one that was in the dom was just a "ghost" or whatever.
    // what we really want is the custom element
    // XXX: only do this if `.replace()`?
    el.parentNode.replaceChild(customEl, el);
    el = customEl;
    // XXX: horrible hack for now
    el.__skip__ = true;
    nodeFn(parentScope, el);
    delete el.__skip__;
    */
    Element.emit('render', el);
    return scope;

    function watch(attr) {
      if (!attrs[attr.name]) return;

      set(); // initialize

      // bind changes in parent scope to this element's
      // isolated scope
      var unwatch = attrs[attr.name].watch(parentScope, set);

      scope.on('remove', unwatch);

      function set() {
        scope.set(attr.name, attrs[attr.name].fn(parentScope))
      }
    }
  }
}