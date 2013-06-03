
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

  });

  it('should have actions', function(){

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
});