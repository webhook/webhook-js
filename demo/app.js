/* global $:false, Webhook:false */
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


  /* SELECT FILE */

  var selectFileBtn = $('#select-file button.single').selectFile();
  var selectFilesBtn = $('#select-file button.multiple').selectFile({ multiple: true });
  var selectImagesBtn = $('#select-file button.images').selectFile({ multiple: true, accept: 'image/*' });

  selectFileBtn.add(selectFilesBtn).add(selectImagesBtn).on('selectedFile', function (event, file) {
    var fileelement = $('<li>').appendTo('#select-file .filenames').text(file.name);
    setTimeout(function () {
      fileelement.fadeOut(500, function () {
        $(this).remove();
      });
    }, 5000);
  });


  /* DROPZONE */

  $('.wy-alert[data-dropzone]').on('drop', function (event) {
    var files = event.originalEvent.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      $('<p>').appendTo(this).text(files[i].name);
    }
  });


  /* UPLOAD */

  // create uploader with required params
  var uploader = new Webhook.Uploader($('#uploadUrl').val(), $('#uploadSite').val(), $('#uploadToken').val());

  var uploadButton = $('#upload button.icon-image');

  // when a file is selected, upload
  uploadButton.selectFile().on('selectedFile', function (event, file) {

    $('.wy-form-upload-container').show();
    $('.wy-form-upload-url').hide();
    $(this).hide();
    $('.wy-form-upload .image-loading').css('display', 'inline-block');

    // upload returns promise
    var uploading = uploader.upload(file);

    uploading.progress(function (event) {
      var percentage = Math.ceil((event.loaded * 100) / event.total);
      if (percentage < 100) {
        $('.wy-form-upload .image-loading span').html('Uploading <span>' + percentage + '%</span>');
      } else {
        $('.wy-form-upload .image-loading span').text('Finishing up...');
      }
    });

    uploading.done(function (response) {
      $('#upload .output').val(response.url);
    });

    uploading.always(function () {
      $('.wy-form-upload .image-loading').hide();
      uploadButton.show();
    });

  });

  $('.wy-form-upload-url .upload-url').on('click', function () {
    uploadButton.trigger('selectedFile', $('.wy-form-upload-url input').val());
    $('.wy-form-upload-url input').val('');
  });

  $('.upload-method-toggle').on('click', function () {
    $('.wy-form-upload-container, .wy-form-upload-url').toggle();
  });

  var resetButton = function () {
    $(this)
      .removeClass('icon-desktop icon-arrow-down btn-success')
      .addClass('icon-image btn-neutral')
      .text(' Drag or select image');
  };

  // Dropzone behavior
  uploadButton.dropzone().on({
    dropzonewindowenter: function () {
      $(this)
        .removeClass('icon-image icon-desktop btn-neutral')
        .addClass('icon-arrow-down btn-success')
        .text(' Drop files here');
    },
    dropzonewindowdrop: resetButton,
    dropzonewindowleave: resetButton,
    drop: function (event) {
      $(this).trigger('selectedFile', event.originalEvent.dataTransfer.files[0]);
      resetButton.call(this);
    }
  });

  // Just some additional styles
  uploadButton.on({
    mouseenter: function () {
      $(this)
        .removeClass('icon-image icon-arrow-down btn-success')
        .addClass('icon-desktop btn-neutral')
        .text(' Select from desktop');
    },
    mouseleave: resetButton
  });

})();
