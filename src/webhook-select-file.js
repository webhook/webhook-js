/*
 * Webhook Select File
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 *
 */

(function ($) {

  "use strict";

  var SelectFile = function () {
    this.init.apply(this, arguments);
  };

  SelectFile.prototype = {
    init: function (element, options) {

      this.$element = $(element);

      this.options = this._getOptions(options);

      // We need this for OS file selection
      this.$fileinput = $('<input type="file">').hide().appendTo('body');

      // Only accept certain filetypes?
      if (this.options.accept) {
        this.$fileinput.attr('accept', this.options.accept);
      }

      // Allow multiple file selection?
      if (this.options.multiple) {
        this.$fileinput.attr('multiple', true);
      }

      this.observeFileInput();

      this.$element.on('click', $.proxy(this.selectFile, this));

      return arguments;

    },

    _getOptions: function (options) {
      return $.extend({}, $.fn.selectFile.defaults, this.$element.data(), options);
    },

    observeFileInput: function () {
      var self = this;
      this.$fileinput
        .off('change')
        .off('click')
        .on('change', function () {

          $.each(this.files, function (index, file) {
            self.$element.trigger('selectedFile', file);
          });

          // reset file input
          self.$fileinput = $(this).clone();
          $(this).replaceWith(self.$fileInput);
          self.observeFileInput();
        })
        .on('click', function (event) {
          event.stopPropagation();
        });
    },

    selectFile: function () {
      this.$fileinput.trigger('click');
    }

  };


  /* SELECT FILE PLUGIN DEFINITION
   * ======================== */

  $.fn.selectFile = function (option) {

    var selectFileArguments = arguments;

    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('selectFile'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('selectFile', (data = new SelectFile(this, options)));
      }

      if (typeof option === 'string') {
        data[option].apply(data, Array.prototype.slice.call(selectFileArguments, 1));
      }
    });

  };

  $.fn.selectFile.Constructor = SelectFile;

  $.fn.selectFile.defaults = {
    multiple: false,
    accept: null
  };

}(window.jQuery));
