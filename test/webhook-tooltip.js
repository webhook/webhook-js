(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('Tooltip');

  test('is defined on jQuery object', function () {
    ok($('<div></div>').tooltip, 'tooltip plugin is defined');
  });

  test('is chainable', function () {
    var elems = $('<div></div>');
    strictEqual(elems.tooltip(), elems, 'should be chainable');
  });

  test("should empty title attribute", function () {
    var tooltip = $('<a href="#" title="Another tooltip"></a>').tooltip();
    ok(tooltip.attr('title') === '', 'title attribute was emptied');
  });

  test("should add data attribute for referencing original title", function () {
    var tooltip = $('<a href="#" title="Another tooltip"></a>').tooltip();
    strictEqual(tooltip.attr('data-original-title'), 'Another tooltip', 'original title preserved in data attribute');
  });

  test("pass in title with options", function () {
    var tooltip = $('<a href="#" title="Another tooltip"></a>').tooltip({ title: 'optional title'} );
    strictEqual(tooltip.attr('data-original-title'), 'optional title', 'original title preserved in data attribute');
  });

  // test('is awesome', function () {
  //   expect(1);
  //   strictEqual(this.elems.awesome().text(), 'awesome0awesome1awesome2', 'should be awesome');
  // });

  // module('jQuery.awesome');

  // test('is awesome', function () {
  //   expect(2);
  //   strictEqual($.awesome(), 'awesome.', 'should be awesome');
  //   strictEqual($.awesome({punctuation: '!'}), 'awesome!', 'should be thoroughly awesome');
  // });

  // module(':awesome selector', {
  //   // This will run before each test in this module.
  //   setup: function () {
  //     this.elems = $('#qunit-fixture').children();
  //   }
  // });

  // test('is awesome', function () {
  //   expect(1);
  //   // Use deepEqual & .get() when comparing jQuery objects.
  //   deepEqual(this.elems.filter(':awesome').get(), this.elems.last().get(), 'knows awesome when it sees it');
  // });

}(jQuery));
