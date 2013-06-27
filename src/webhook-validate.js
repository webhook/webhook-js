/*
 * Webhook Validate
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var Validate = function (element, options) {
    this.init(element, options);
  };

  Validate.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* VALIDATE PLUGIN DEFINITION
   * ========================== */

  $.fn.validate = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('validate'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('validate', (data = new Validate(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.validate.Constructor = Validate;

  $.fn.validate.defaults = {};

}(window.jQuery));
