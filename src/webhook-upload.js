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

      this.$element = $(element);

      this.options = this.getOptions(options);

      var uploader = this;

      // we need this for OS file selection
      this.$fileinput = $('<input type="file" multiple>').hide().insertAfter(element).on({
        change: function () {
          uploader.upload(this.files);
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
      $("[data-upload-trigger='" + this.options.uploadGroup + "'] .image-desktop").on('click', $.proxy(function () {
        this.$fileinput.trigger('click.wh.upload');
      }, this));
    },

    initDropzones: function () {

      var dropzone = this.$dropzone = $("[data-upload-dropzone='" + this.options.uploadGroup + "']");

      if (!dropzone.length) {
        return;
      }

      var windowlayer = 0;

      // prevent miss-drops
      $(window).on({
        dragover: $.proxy(function (event) {
          event.preventDefault();
          this.$element.trigger('dragover.wh.upload');
        }, this),
        dragenter: $.proxy(function (event) {
          event.preventDefault();
          windowlayer++;
          if (windowlayer) {
            this.$element.trigger('dragenter.wh.upload');
          }
        }, this),
        dragleave: $.proxy(function (event) {
          event.preventDefault();
          windowlayer--;
          if (!windowlayer) {
            this.$element.trigger('dragleave.wh.upload');
          }
        }, this),
        drop: $.proxy(function (event) {
          event.preventDefault();
          windowlayer--;
          this.$element.trigger('dragdrop.wh.upload');
        }, this)
      });

      var dropzonelayer = 0;

      // Handle drag and drop from OS.
      dropzone.on({
        dragover: function (event) {
          event.preventDefault();
          event.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        },
        dragenter: $.proxy(function (event) {
          event.preventDefault();
          dropzonelayer++;
          if (dropzonelayer) {
            this.$element.trigger('dragenterdropzone.wh.upload');
          }
        }, this),
        dragleave: $.proxy(function (event) {
          event.preventDefault();
          dropzonelayer--;
          if (!dropzonelayer) {
            this.$element.trigger('dragleavedropzone.wh.upload');
          }
        }, this),
        drop: $.proxy(function (event) {
          event.preventDefault();
          dropzonelayer--;
          this.$element.trigger('dragdropdropzone.wh.upload');
          this.upload(event.originalEvent.dataTransfer.files);
        }, this)
      });

    },

    upload: function (files) {

      this.$element.trigger('start.wh.upload');

      if (!files) {
        this.$element.trigger('error.wh.upload', 'No file selected.');
        return;
      }

      if (!this.options.uploadUrl) {
        this.$element.trigger('error.wh.upload', 'No upload url specified.');
        return;
      }

      var xhr  = new XMLHttpRequest(),
          data = new FormData();

      this.xhr = xhr;

      this.xhr.upload.addEventListener("progress", $.proxy(function (event) {
        if (event.lengthComputable) {
          this.$element.trigger('progress.wh.upload', Math.ceil((event.loaded * 100) / event.total));
        }
      }, this), false);

      this.xhr.addEventListener('readystatechange', $.proxy(function () {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === 200) {
            this.$element.trigger('load.wh.upload', this.xhr.responseText);
          } else {
            this.$element.trigger('error.wh.upload', this.xhr.responseText);
          }
        }
      }, this), false);

      data.append('site', 'test');
      data.append('token', '5e13aef1-8aa8-41b4-8619-2eaf62c0ae49');
      data.append('payload', files[0]);

      xhr.open("POST", this.options.uploadUrl);

      xhr.send(data);

      this.createThumbnails(files, $.proxy(function (thumb) {
        this.$element.trigger('thumb.wh.upload', thumb);
      }, this));
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
            var exif = new ExifReader(),
                orientation = 1;

            // Parse the Exif tags.
            exif.load(evt.target.result);
            orientation = exif.getTagValue('Orientation');

            switch (orientation) {
              case 3:
              case 4:
                thumb.addClass('rotate-180');
                break;
              case 5:
              case 6:
                thumb.addClass('rotate-90');
                break;
              case 7:
              case 8:
                thumb.addClass('rotate-270');
                break;
            }

            if ($.inArray(orientation, [2, 4, 5, 7]) >= 0) {
              thumb.addClass('flip-h');
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
