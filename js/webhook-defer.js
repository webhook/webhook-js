/*
 * Webhook Defer
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var Defer = function (element, options) {
    this.init(element, options);
  };

  Defer.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* DEFER PLUGIN DEFINITION
   * ======================= */

  $.fn.defer = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('defer'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('defer', (data = new Defer(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.defer.Constructor = Defer;

  $.fn.defer.defaults = {};

}(window.jQuery));
