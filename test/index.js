
var directive = require('tower-directive');
var template = require('tower-template');
var content = require('tower-content');
var document = 'undefined' !== typeof window && document;

if ('undefined' === typeof window) {
  var element = require('..');
  var assert = require('assert');
  var jsdom = require('jsdom').jsdom;
  var fs = require('fs');
  var path = require('path');
  document = jsdom(fs.readFileSync(path.join(__dirname, 'index.html')));
} else {
  var element = require('tower-element');
  var assert = require('timoxley-assert');
  var document = window.document;
}

require('tower-text-directive');

describe('element', function(){
  beforeEach(element.clear);

  it('should be custom!', function(){
    var el = document.querySelector('random');
    var calls = [];

    // define custom element.
    element('random').attr('foo')
      .on('init', function(_el){
        el = _el;
        calls.push('init');
      })
      .on('render', function(el){
        calls.push('render');
      });

    var fn = template(el);
    var scope = content('asdf').init({ foo: 'bar' });
    fn(scope);
    assert('init render' === calls.join(' '));
    assert('bar' === document.querySelector('random').textContent);
  });

  it('should be custom with nesting!', function(){
    var el = document.querySelector('background');

    // define custom element.
    element('background')
      .attr('color')
      .template('<span>color: </span><span data-text="color"></span>');

    var fn = template(el);
    var scope = content('asdf').init();
    fn(scope);
    console.log(el.children[0].__scope__);
  });

  /*it('should define', function(done){
    element.on('define', function(Popup){
      assert('popup' === Popup.id);
      done();
    });

    element('popup');
  });

  it('should have attrs', function(){
    element('popup')
      .template('<h1 data-text="title"></h1>')
      .attr('title');

    var obj = element('popup').init({ title: 'Hello World!' });
    var el = obj.render();
    assert('Hello World!' === el.textContent);
  });

  it('should have actions', function(){
    element('popup')
      .template('<a data-text="title" href="#" on-click="anAction()"></a>')
      .attr('title')
      .action('anAction', function(){
        console.log('an action');
      });

    var obj = element('popup').init({ title: 'Click Here' });
    var el = obj.render();

    //document.body.insertBefore(el, document.body.firstChild);
  });

  it('should support defining custom DSL methods', function(done){
    element('page')
      .method('widget', function(page, a, b){
        assert(page === element('page'));
        assert('a' === a);
        assert('b' === b);
        done();
      })
      .widget('a', 'b');
  });

  it('should inherit', function(){
    element('parent-element')
      .attr('title')
      .attr('checked', 'boolean', true);

    element('child-element')
      .inherit('parent-element')
      .attr('description');

    var content = element('child-element').content;
    // XXX: need to fix attr name
    assert('parent-element' === element('child-element').superclasses[0]);
    assert('child-element' === element('parent-element').subclasses[0]);
  });

  it('should create directive', function(done){
    assert(!directive.has('background'));
    
    element('background').attr('src').on('render', function(_scope, _el){
      console.log(_el.getAttribute('src'));
      console.log(_scope.get('src'));
      done();
    });

    assert(directive.has('background'));
    var el = document.body.children[0];
    var fn = template(el);
    var scope = content('random').init({ image: '/foo.png' });
    fn(scope);
  });*/
});