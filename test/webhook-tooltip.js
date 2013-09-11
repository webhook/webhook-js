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

  test('basic jQuery functionality', function () {
    expect(2);
    var el = $('<div>');
    ok(el.tooltip, 'tooltip plugin is defined');
    strictEqual(el.tooltip(), el, 'should be chainable');
  });

  test("title handling", function () {
    var tooltip = $('<a href="#" title="Another tooltip"></a>').tooltip();
    ok(tooltip.attr('title') === '', 'title attribute was emptied');
    strictEqual(tooltip.attr('data-original-title'), 'Another tooltip', 'original title preserved in data attribute');
  });

  test("options", function () {
    var tooltip = $('<a href="#" title="Another tooltip"></a>').tooltip({ title: 'optional title'} );
    strictEqual(tooltip.attr('data-original-title'), 'optional title', 'original title preserved in data attribute');
  });

}(jQuery));
