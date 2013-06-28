/*
 * Webhook Autocomplete
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var Autocomplete = function (element, options) {
    this.init(element, options);
  };

  Autocomplete.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* AUTOCOMPLETE PLUGIN DEFINITION
   * ============================== */

  $.fn.autocomplete = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('autocomplete'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('autocomplete', (data = new Autocomplete(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.autocomplete.Constructor = Autocomplete;

  $.fn.autocomplete.defaults = {};

}(window.jQuery));
