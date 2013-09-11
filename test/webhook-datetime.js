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

  module('Datetime', {
    setup: function () {
      this.input = $('<input value="June 27, 2013">').appendTo('#qunit-fixture');
    },
    teardown: function () {
      this.input.remove();
    }
  });

  test('basic jQuery funcionality', function () {
    ok(this.input.datetime, 'plugin is defined');
    strictEqual(this.input.datetime(), this.input, 'should be chainable');
  });

  test('show and hide manually', function () {
    this.input.datetime('show');
    ok(this.input.datetime('widget').is(':visible'), 'should show manually');
    this.input.datetime('hide');
    ok(!this.input.datetime('widget').is(':visible'), 'should hide manually');
  });

  test('show on focus, hide when clicking on document', function () {
    this.input.datetime();

    this.input.trigger("focus");
    ok(this.input.datetime('widget').is(':visible'), 'should show on focus');

    this.input.trigger('click');
    ok(this.input.datetime('widget').is(':visible'), 'do not hide when clicking on input');

    this.input.datetime('widget').trigger('click');
    ok(this.input.datetime('widget').is(':visible'), 'do not hide when clicking on datetime');

    $(document).trigger('click');
    ok(!this.input.datetime('widget').is(':visible'), 'hide datetime if click makes it to document');
  });

}(jQuery));
