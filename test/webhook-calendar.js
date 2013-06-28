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

  module('Calendar', {
    setup: function () {
      this.input = $('<input value="June 27, 2013">').appendTo('#qunit-fixture');
    },
    teardown: function () {
      this.input.remove();
    }
  });

  test('is defined on jQuery object', function () {
    ok(this.input.calendar, 'calendar plugin is defined');
  });

  test('is chainable', function () {
    strictEqual(this.input.calendar(), this.input, 'should be chainable');
  });

  test('show and hide manually', function () {
    this.input.calendar('show');
    ok(this.input.calendar('widget').is(':visible'), 'should show manually');
    this.input.calendar('hide');
    ok(!this.input.calendar('widget').is(':visible'), 'should hide manually');
  });

  test('show on focus, hide when clicking on document', function () {
    this.input.calendar();

    this.input.trigger("focus");
    ok(this.input.calendar('widget').is(':visible'), 'should show on focus');

    this.input.trigger('click');
    ok(this.input.calendar('widget').is(':visible'), 'do not hide when clicking on input');

    this.input.calendar('widget').trigger('click');
    ok(this.input.calendar('widget').is(':visible'), 'do not hide when clicking on calendar');

    $(document).trigger('click');
    ok(!this.input.calendar('widget').is(':visible'), 'hide calendar if click makes it to document');
  });

}(jQuery));
