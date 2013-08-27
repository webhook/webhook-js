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

      this.$fileinput = $('<input type="file" multiple>').insertAfter(element);

      this.$dropzone = this.getDropzone(element);

      $('<button class="pure-button">Click</button>').on('click', $.proxy(function () {
        this.$fileinput.trigger('click');
      }, this)).insertBefore(element);

      var uploader = this;
      this.$fileinput.on('change', function () {
        uploader.createThumbnails(this.files, function (thumb) {
          thumb.insertAfter(element);
        });
      });

      return [element, options];

    },

    getDropzone: function (element) {

      if (this.$dropzone) {
        return this.$dropzone;
      }

      // prevent miss-drops
      $(window).on({
        dragover: function (event) {
          event.preventDefault();
        },
        drop: function (event) {
          event.preventDefault();
        }
      });

      // Handle drag and drop from OS.
      var dropzone = $('<div>').css({
        height: 200,
        width: 200,
        border: '1px solid black'
      }).insertBefore(element);

      dropzone.on({
        dragover: function (event) {
          event.stopPropagation();
          event.preventDefault();

          event.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        },
        dragenter: function () {
          dropzone.css('background', 'blue');
        },
        dragleave: function () {
          dropzone.css('background', 'transparent');
        },
        drop: $.proxy(function (event) {
          event.stopPropagation();
          event.preventDefault();

          dropzone.css('background', 'transparent');

          this.createThumbnails(event.originalEvent.dataTransfer.files, function (thumb) {
            thumb.insertAfter(element);
          });
        }, this)
      });

      return dropzone;
    },

    createThumbnails: function (files, callback) {
      $.each(files, function () {
        var thumb = $('<img>').attr({
          src: (window.URL || window.webkitURL).createObjectURL(this)
        }).css('max-width', 200);

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
        reader.readAsArrayBuffer(this);
      });
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

  $.fn.upload.defaults = {};

 /* UPLOAD DATA-API
  * =============== */

  $(window).on('load', function () {
    $('[data-upload][type=text]').each(function () {

      var $element = $(this),
          data     = $element.data();

      $element.upload(data);

    });
  });

}(window.jQuery));
