/*
 * Webhook Menu
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var Menu = function (element, options) {
    this.init(element, options);
  };

  Menu.prototype = {
    init: function (element, options) {
      return [element, options];
    }
  };

  /* MENU PLUGIN DEFINITION
   * ====================== */

  $.fn.menu = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('menu'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('menu', (data = new Menu(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.menu.Constructor = Menu;

  $.fn.menu.defaults = {};

}(window.jQuery));
