
if ('undefined' === typeof window) {
  var element = require('..');
  var assert = require('assert');
} else {
  var element = require('tower-element');
  var assert = require('timoxley-assert');
}

describe('element', function(){
  beforeEach(element.clear);

  it('should define', function(done){
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
    $('body').prepend(el);
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
});