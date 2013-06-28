/*
 * Webhook Tab
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var Tab = function (element) {
    this.$element = $(element);
  };

  Tab.prototype = {
    show: function () {

      var selector, $target;

      this.$element.closest('[data-toggle-group]').find('[data-toggle]').removeClass('active');
      this.$element.addClass('active');

      selector = this.$element.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');

      $target = $(selector);

      $target.closest('[data-toggle-target-group]').children().removeClass('active');
      $target.addClass('active');

    }
  };

 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('tab');

      if (!data) {
        $this.data('tab', (data = new Tab(this)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.tab.Constructor = Tab;

 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle]', function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

}(window.jQuery));
