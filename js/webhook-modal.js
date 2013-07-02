/*
 * Webhook Modal
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";

  var Modal = function (element, options) {
    this.init(element, options);
  };

  Modal.prototype = {
    init: function (element, options) {
      this.$element = $(element);
      this.options  = this.getOptions(options);
      this.$body    = $('body');
    },

    getOptions: function (options) {
      return $.extend({}, $.fn.modal.defaults, this.$element.data(), options);
    },

    getTarget: function () {

      var selector;

      selector = this.$element.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');

      return this.$target = $(selector);

    },

    getModal: function () {
      this.$modal = this.$modal || $(this.options.template);
      this.$modal.one('click.modal', function (event) { event.stopPropagation(); });
      return this.$modal;
    },

    getScreen: function () {
      this.$screen = this.$screen || $(this.options.screentemplate);
      this.$screen.one('click.modal', $.proxy(this.hide, this));
      return this.$screen;
    },

    show: function () {
      this.$body.append(this.getScreen(), this.getModal().append(this.getTarget()));
    },

    hide: function () {
      this.getScreen().detach();
      this.getModal().detach();
    }
  };


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('modal'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('modal', (data = new Modal(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.modal.Constructor = Modal;

  $.fn.modal.defaults = {
    cache: true,
    template: "<div class='wh-modal'></div>",
    screentemplate: "<div class='wh-modal-screen'></div>"
  };


 /* MODAL DATA API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle=modal]', function (e) {
    e.preventDefault();
    $(this).modal('show');
  });

}(window.jQuery));
