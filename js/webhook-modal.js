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
      this.$content = $(this.options.contentTemplate);
      this.$close   = $(this.options.closeButton && this.options.closeTemplate);

      // dismiss the modal when ESC is pressed.
      // TODO: only dismiss the top modal
      $(document).on('keyup.modal.dismiss', $.proxy(function (event) {
        if (event.keyCode === 27) {
          this.hide();
        }
      }, this));

    },

    getOptions: function (options) {
      return $.extend({}, $.fn.modal.defaults, this.$element.data(), options);
    },

    getTarget: function (target) {

      var selector;

      selector = target || this.$element.attr('href');
      if (selector.indexOf('#') === 0) {
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
      } else {
        this.getContent().load(selector);
        selector = '<div>loading</div>';
      }

      return this.$target = $(selector);

    },

    getModal: function () {

      if (this.$modal) {
        return this.$modal;
      }

      this.$modal = $(this.options.template).append(this.$close).append(this.$content);
      this.$modal.on('click.modal', function (event) { event.stopPropagation(); });
      this.$modal.on('click.modal.dismiss', '[data-dismiss="modal"]', $.proxy(this.hide, this));
      if (this.options.captureLinks) {
        this.$modal.on('click.modal', 'a[href]', $.proxy(function (event) {
          event.preventDefault();
          this.show($(event.target).attr('href'));
        }, this));
      }

      return this.$modal;
    },

    getContent: function () {
      return this.$content;
    },

    getScreen: function () {
      this.$screen = this.$screen || $(this.options.screenTemplate);
      this.$screen.one('click.modal', $.proxy(this.hide, this));
      return this.$screen;
    },

    show: function (target) {
      this.getContent().append(this.getTarget(target));
      this.$body.append(this.getScreen(), this.getModal());
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
    contentTemplate: "<div class='wh-modal-content'></div>",
    closeTemplate: "<a class='wh-modal-close' data-dismiss='modal'>&times;</a>",
    screenTemplate: "<div class='wh-modal-screen'></div>",
    closeButton: true,
    captureLinks: true
  };


 /* MODAL DATA API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle=modal]', function (e) {
    e.preventDefault();
    $(this).modal('show');
  });

}(window.jQuery));
