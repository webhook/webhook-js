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

  module('Autocomplete');

  test('is defined on jQuery object', function () {
    ok($('<div></div>').autocomplete, 'tooltip plugin is defined');
  });

  test('is chainable', function () {
    var elems = $('<div></div>');
    strictEqual(elems.autocomplete(), elems, 'should be chainable');
  });

}(jQuery));
