/* global $:false */
(function () {

  'use strict';

  // This is so I don't have to put these values in the repo
  ['uploadUrl', 'uploadSite', 'uploadToken'].forEach(function (option) {
    if (localStorage.getItem(option)) {
      $('#' + option).val(localStorage.getItem(option));
    }
    $('#' + option).on('change', function () {
      localStorage.setItem(option, $(this).val());
    });
  });

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
      window.alert(response);
    },
    'start.wh.upload': function () {
      $('.wy-form-upload-container').show();
      $('.wy-form-upload-url').hide();
      $(this).data('upload').options.uploadUrl   = $('#uploadUrl').val();
      $(this).data('upload').options.uploadSite  = $('#uploadSite').val();
      $(this).data('upload').options.uploadToken = $('#uploadToken').val();
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
        $(this).data('upload').$dropzone.find('.image-loading span').html('Uploading <span>' + percentage + '%</span>');
      } else {
        $(this).data('upload').$dropzone.find('.image-loading span').text('Finishing up...');
      }
    },
    'load.wh.upload': function (event, response) {
      $(this).data('upload').$dropzone.removeClass('wy-form-uploading');
      $(this).data('upload').$element.val(response.url);
    }
  });

  $('.wy-form-upload-url .upload-url').on('click', function () {
    $('[data-upload]:input').upload('upload', $('#url').val());
    $('#url').val('');
  });

  $('.upload-method-toggle').on('click', function () {
    $('.wy-form-upload-container, .wy-form-upload-url').toggle();
  });

})();
