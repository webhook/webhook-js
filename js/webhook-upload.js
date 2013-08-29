/*
 * Webhook Upload
 * https://github.com/webhook/webhook-js
 *
 * Copyright (c) 2013
 * Licensed under the MIT license.
 *
 * Todo:
 * - read exif to detect rotation. rotate thumbnail.
 */

(function ($) {

  "use strict";

  var Upload = function (element, options) {
    this.init(element, options);
  };

  Upload.prototype = {
    init: function (element, options) {

      this.$element = $(element).hide();

      this.options = this.getOptions(options);

      var uploader = this;

      // we need this for OS file selection
      this.$fileinput = $('<input type="file" multiple>').hide().insertAfter(element).on({
        change: function () {
          uploader.createThumbnails(this.files, function (thumb) {
            uploader.$element.trigger('thumb.wh.upload', thumb);
          });
        },
        click: function (event) {
          event.stopPropagation();
        }
      });

      this.initTriggers();
      this.initDropzones();

      return [element, options];

    },

    getOptions: function (options) {
      return $.extend({}, $.fn.upload.defaults, this.$element.data(), options);
    },

    initTriggers: function () {
      $("[data-upload-trigger='" + this.options.uploadGroup + "']").on('click', $.proxy(function () {
        this.$fileinput.trigger('click.wh.upload');
      }, this));
    },

    initDropzones: function () {

      var dropzone = this.$dropzone = $("[data-upload-dropzone='" + this.options.uploadGroup + "']");

      if (!dropzone.length) {
        return;
      }

      // prevent miss-drops
      $(window).on({
        dragover: $.proxy(function (event) {
          event.preventDefault();
          this.$element.trigger('dragover.wh.upload');
        }, this),
        dragenter: $.proxy(function (event) {
          event.preventDefault();
          this.$element.trigger('dragenter.wh.upload');
        }, this),
        dragleave: $.proxy(function (event) {
          event.preventDefault();
          this.$element.trigger('dragleave.wh.upload');
        }, this),
        drop: $.proxy(function (event) {
          event.preventDefault();
          this.$element.trigger('drop.wh.upload');
        }, this)
      });

      // Handle drag and drop from OS.
      dropzone.on({
        dragover: function (event) {
          event.preventDefault();

          event.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        },
        dragenter: $.proxy(function (event) {
          event.preventDefault();
          this.$element.trigger('dragenterdropzone.wh.upload');
        }, this),
        dragleave: $.proxy(function (event) {
          event.preventDefault();
          this.$element.trigger('dragleavedropzone.wh.upload');
        }, this),
        drop: $.proxy(function (event) {
          event.preventDefault();

          this.createThumbnails(event.originalEvent.dataTransfer.files, $.proxy(function (thumb) {
            this.$element.trigger('thumb.wh.upload', thumb);
          }, this));
        }, this)
      });

    },

    createThumbnails: function (files, callback) {
      $.each(files, $.proxy(function (index, file) {
        var thumb = $('<img>').attr({
          src: (window.URL || window.webkitURL).createObjectURL(file)
        }).css({
          'max-width': this.options.thumbmax,
          'max-height': this.options.thumbmax
        });

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = function(evt) {
          try {
            var exif = new ExifReader();

            // Parse the Exif tags.
            exif.load(evt.target.result);

            switch (exif.getTagValue('Orientation')) {
              case 2:
                thumb.addClass('mirror');
                break;
              case 3:
                thumb.addClass('rot-180');
                break;
              case 4:
                thumb.addClass('rot-180 mirror');
                break;
              case 5:
                thumb.addClass('rot-90 mirror');
                break;
              case 6:
                thumb.addClass('rot-90');
                break;
              case 7:
                thumb.addClass('rot-270 mirror');
                break;
              case 8:
                thumb.addClass('rot-270');
                break;
            }
          }
          catch (error) {
            window.console.log(error);
          }
          callback(thumb);
        };

        // Read in the image file as a data URL.
        reader.readAsArrayBuffer(file);
      }, this));
    }
  };

  /* UPLOAD PLUGIN DEFINITION
   * ======================== */

  $.fn.upload = function (option) {
    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('upload'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('upload', (data = new Upload(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.upload.Constructor = Upload;

  $.fn.upload.defaults = {
    thumbmax: 100
  };

 /* UPLOAD DATA-API
  * =============== */

  $(window).on('load', function () {
    $('[data-upload]:input').each(function () {

      var $element = $(this),
          data     = $element.data();

      $element.upload(data);

    });
  });

}(window.jQuery));
