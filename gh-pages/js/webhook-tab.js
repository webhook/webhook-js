/*
 * Webhook Tab
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var Tab = function (element, options) {
    this.init(element, options);
  };

  Tab.prototype = {
    init: function (element, options) {
      this.$element = $(element);
      this.options = this.getOptions(options);
    },

    getOptions: function (options) {
      return $.extend({}, $.fn.tab.defaults, this.$element.closest('[data-toggle-group]').data(), this.$element.data(), options);
    },

    show: function () {

      var selector, $target, $targetGroup, groupOptions;

      this.$element.closest('[data-toggle-group]').find('[data-toggle]').parent().removeClass(this.options.activetabclass);
      this.$element.parent().addClass(this.options.activetabclass);

      selector = this.$element.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');

      $target = $(selector);
      $targetGroup = $target.closest('[data-toggle-target-group]');

      groupOptions = $.extend({}, this.options, $targetGroup.data());

      $targetGroup.children().removeClass(groupOptions.activepaneclass);
      $target.addClass(groupOptions.activepaneclass);

    }
  };


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('tab'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('tab', (data = new Tab(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.tab.Constructor = Tab;

  $.fn.tab.defaults = {
    activetabclass: 'active',
    activepaneclass: 'active'
  };


 /* TAB DATA-API
  * ============== */

  $(document).on('click.tab.data-api', '[data-toggle=tab]', function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

}(window.jQuery));
