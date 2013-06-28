/*
 * Webhook Affix
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var Affix = function (element, options) {
    this.init(element, options);
  };

  Affix.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* AFFIX PLUGIN DEFINITION
   * ======================= */

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('affix'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('affix', (data = new Affix(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.affix.Constructor = Affix;

  $.fn.affix.defaults = {};

}(window.jQuery));
