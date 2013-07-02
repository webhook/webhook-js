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

  module('Tab');

  test('is defined on jQuery object', function () {
    ok($('<div></div>').tab, 'tooltip plugin is defined');
  });

  test('is chainable', function () {
    var elems = $('<div></div>');
    strictEqual(elems.tab(), elems, 'should be chainable');
  });

  // test('show makes tab "active"', function () {
  //   var elems = $('<a>').tab('show');
  //   ok(elems.hasClass('active'), 'should be active');
  // });

  // test('other tabs inaactive', function () {
  //   var elems = $('<nav data-toggle-group><a></a><a></a></nav>').children().first().tab('show');
  //   ok(!elems.children().last().is('.active'), 'other tabs should not be active');
  // });

}(jQuery));
