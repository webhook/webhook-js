/*
 * Webhook Button
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var Button = function (element, options) {
    this.init(element, options);
  };

  Button.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* BUTTON PLUGIN DEFINITION
   * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('button'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('button', (data = new Button(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.button.Constructor = Button;

  $.fn.button.defaults = {};

}(window.jQuery));
