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
          uploader.upload(this.files[0]);
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
      this.$triggerElement = this.options.uploadTrigger || $("[data-upload-trigger='" + this.options.uploadGroup + "']");
      this.$triggerElement.on({
        click: $.proxy(function () {
          this.$fileinput.trigger('click.wh.upload');
        }, this)
      });
    },

    initDropzones: function () {

      var dropzone = this.$dropzone = this.options.uploadDropzone || $("[data-upload-dropzone='" + this.options.uploadGroup + "']");

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
          this.upload(event.originalEvent.dataTransfer.files[0]);
        }, this)
      });

    },

    upload: function (file) {

      this.$element.trigger('start.wh.upload');

      if (!this.options.uploadUrl) {
        this.$element.trigger('error.wh.upload', 'No upload url specified.');
        return;
      }

      if (typeof file === 'string') {
        this.uploadUrl(file);
      } else {
        this.uploadFile(file);
      }

    },

    uploadFile: function (file) {

      if (!file) {
        this.$element.trigger('error.wh.upload', 'No file selected.');
        return;
      }

      this.createThumbnail(file, $.proxy(function (thumb) {
        this.$element.trigger('thumb.wh.upload', thumb);
      }, this));

      var data = new FormData();
      data.append('payload', file);
      data.append('site', this.options.uploadSite);
      data.append('token', this.options.uploadToken);

      var self = this;

      return $.ajax({

        // Upload progress
        xhr: function () {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (event) {
            if (event.lengthComputable) {
              self.$element.trigger('progress.wh.upload', Math.ceil((event.loaded * 100) / event.total));
            }
          }, false);
          return xhr;
        },

        url: this.options.uploadUrl + 'upload-file/',
        type: 'post',
        data: data,
        dataType: 'json',
        contentType: false,
        processData: false
      }).done($.proxy(function (response) {
        this.$element.trigger('load.wh.upload', response);
      }, this)).fail($.proxy(function (response) {
        this.$element.trigger('error.wh.upload', response);
      }, this));

    },

    uploadUrl: function (url) {

      if (!url) {
        this.$element.trigger('error.wh.upload', 'No URL given.');
        return;
      }

      this.$element.trigger('progress.wh.upload', 100);

      return $.ajax({
        url: this.options.uploadUrl + 'upload-url/',
        type: 'post',
        data: {
          url  : url,
          site : this.options.uploadSite,
          token: this.options.uploadToken
        },
        dataType: 'json'
      }).done($.proxy(function (response) {
        this.$element.trigger('load.wh.upload', response);
        this.$element.trigger('thumb.wh.upload', $('<img>').attr('src', response.url));
      }, this)).fail($.proxy(function (response) {
        this.$element.trigger('error.wh.upload', response);
      }, this));

    },

    createThumbnail: function (file, callback) {

      var thumb = $('<img>').attr({
        src: (window.URL || window.webkitURL).createObjectURL(file)
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
          // Ignore for now
        }

        callback(thumb);
      };

      // Read in the image file as a data URL.
      reader.readAsArrayBuffer(file);

    }
  };

  /* UPLOAD PLUGIN DEFINITION
   * ======================== */

  $.fn.upload = function (option) {

    var uploadArguments = arguments;

    return this.each(function () {
      var $this   = $(this),
          data    = $this.data('upload'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('upload', (data = new Upload(this, options)));
      }

      if (typeof option === 'string') {
        data[option].apply(data, Array.prototype.slice.call(uploadArguments, 1));
      }
    });

  };

  $.fn.upload.Constructor = Upload;

  $.fn.upload.defaults = {};

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
