/*
 * Webhook Dropzone
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 *
 */

(function ($) {

  "use strict";

  var Dropzone = function (element) {
    this.init(element);
  };

  Dropzone.prototype = {
    init: function (element) {

      this.$element = $(element);

      this._observeWindow();
      this._observeElement();

    },

    _observeWindow: function () {

      var windowlayer = 0;

      // prevent miss-drops
      $(window).on({
        dragover: function (event) {
          event.preventDefault();
        },
        dragenter: $.proxy(function (event) {
          event.preventDefault();
          windowlayer++;
          if (windowlayer) {
            this.$element.trigger('dropzonewindowenter');
          }
        }, this),
        dragleave: $.proxy(function (event) {
          event.preventDefault();
          windowlayer--;
          if (!windowlayer) {
            this.$element.trigger('dropzonewindowleave');
          }
        }, this),
        drop: $.proxy(function (event) {
          event.preventDefault();
          windowlayer = 0;
          this.$element.trigger('dropzonewindowdrop');
        }, this)
      });

    },

    _observeElement: function () {

      var dropzonelayer = 0;

      // Handle drag and drop from OS.
      this.$element.on({
        dragover: function (event) {
          event.preventDefault();
          event.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        },
        dragenter: $.proxy(function (event) {
          event.preventDefault();
          dropzonelayer++;
          if (dropzonelayer === 1) {
            this.$element.trigger('dropzoneenter', event);
          }
        }, this),
        dragleave: $.proxy(function (event) {
          event.preventDefault();
          dropzonelayer--;
          if (!dropzonelayer) {
            this.$element.trigger('dopzoneleave', event);
          }
        }, this),
        drop: function (event) {
          event.preventDefault();
          dropzonelayer = 0;
        }
      });

    }
  };

  /* DROPZONE PLUGIN DEFINITION
   * ========================== */

  $.fn.dropzone = function (option) {

    var uploadArguments = arguments;

    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('dropzone'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('dropzone', (data = new Dropzone(this, options)));
      }

      if (typeof option === 'string') {
        data[option].apply(data, Array.prototype.slice.call(uploadArguments, 1));
      }
    });

  };

  $.fn.dropzone.Constructor = Dropzone;

  $.fn.dropzone.defaults = {};

 /* DROPZONE DATA-API
  * ================= */

  $(window).on('load', function () {
    $('[data-dropzone]').each(function () {

      var $element = $(this),
          data     = $element.data();

      $element.dropzone(data);

    });
  });

}(window.jQuery));
