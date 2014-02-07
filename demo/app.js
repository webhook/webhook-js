/* global $:false */
(function () {

  'use strict';

  $('[data-upload]:input').on({
    'dragenter.wh.upload': function () {
      $(this).data('upload').$dropzone.addClass('wh-form-upload-drop');
    },
    'dragleave.wh.upload': function () {
      $(this).data('upload').$dropzone.removeClass('wh-form-upload-drop');
    },
    'dragdrop.wh.upload': function () {
      $(this).data('upload').$dropzone.removeClass('wh-form-upload-drop');
    },
    'error.wh.upload': function (event, response) {
      $(this).data('upload').$dropzone.removeClass('wy-form-uploading');
      $(this).data('upload').$dropzone.find('.image-error').show().text(response);
    },
    'start.wh.upload': function () {
      $(this).data('upload').options.uploadUrl = $('#uploadUrl').val();
      $(this).data('upload').$dropzone.addClass('wy-form-uploading');
      $(this).data('upload').$dropzone.find('.image-error').hide();
      $(this).data('upload').$dropzone.find('.image-loading p').html('Uploading <span>0%</span>');
    },
    'thumb.wh.upload': function (event, thumb) {
      var widget = $(this).data('upload').$dropzone;
      widget.find('.wy-form-upload-image').remove();
      $('<div class="wy-form-upload-image">').append(thumb).prependTo(widget);
    },
    'progress.wh.upload': function (event, percentage) {
      if (percentage < 100) {
        $(this).data('upload').$dropzone.find('.image-loading span').text(percentage + '%');
      } else {
        $(this).data('upload').$dropzone.find('.image-loading p').text('Finishing up...');
      }
    },
    'load.wh.upload': function (event, response) {
      $(this).data('upload').$dropzone.removeClass('wy-form-uploading');
      $(this).data('upload').$element.val(JSON.parse(response).url);
    }
  });

})();
