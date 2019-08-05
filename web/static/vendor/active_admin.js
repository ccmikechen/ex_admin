//= require active_admin/base
//= require jquery
//= require jquery-ui
//= require jquery-migrate-1.1.1

// TODO: move this to a file provided by ace_contacts plugin
function serializeCategories() {
  var categoryIds = $.makeArray(
    $("table.index_table .category").map(function() {
      return $(this).data('id');
    })
  );
  return {ids: categoryIds};
};

function showCropper(input, field, name, aspect) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#' + field + '_image_container').remove();

      var container = document.createElement('div');
      container.id = field + '_image_container';
      $(input).after(container);

      var preview = document.createElement('img');
      preview.id = field + '_preview';
      preview.src = e.target.result;
      $(container).append(preview);

      var cropBtn = document.createElement('input');
      cropBtn.type = 'button';
      cropBtn.id = field + '_crop_btn';
      cropBtn.value = 'Crop';
      $(preview).after(cropBtn);
    };
    reader.readAsDataURL(input.files[0]);
    setTimeout(function() {
      initCropper(field, name, aspect);
    }, 100);
  }
}

function initCropper(field, name, aspect) {
  var $file = $('#' + field);
  var $image = $('#' + field + '_preview');
  $image.cropper({ aspectRatio: aspect });
  const cropper = $image.data('cropper');

  $('#' + field + '_crop_btn').on("click", function() {
    const $container = $('#' + field + '_image_container');
    $container.empty();

    var imgUrl = cropper.getCroppedCanvas().toDataURL();
    var img = document.createElement('img');
    img.src = imgUrl;
    img.style = 'width: 300px';
    $container.append(img);

    var filenameInput = document.createElement('input');
    filenameInput.type = 'hidden';
    filenameInput.name = name + '[filename]';
    filenameInput.value = $file.val().replace(/.*[\/\\]/, '');
    $container.append(filenameInput);

    var fileInput = document.createElement('input');
    fileInput.type = 'hidden';
    fileInput.name = name + '[base64]';
    fileInput.value = imgUrl;
    $container.append(fileInput);

    $file.val('');
  })
}

$(document).ready(function(){
  // Activating Best In Place
  jQuery(".best_in_place").best_in_place();
  //$('table.index_table tbody').sortable();
  $('#backup-now').click(function(){
    $('#title_bar').after("<div class='flashes'><div class='flash flash_info'>Creating backup. This may take a while ...</div></div>");
    return true;
  });
  $('.restore-link').click(function(e){
    if (e.isPropagationStopped()) {
      $('#title_bar').after("<div class='flashes'><div class='flash flash_info'>Restoring backup. This may take a while ...</div></div>");
    }
    return true;
  });
  $('body.admin_categories table.index_table tbody').sortable({
    update: function(){
      $.ajax({
        url: '/admin/categories/sort',
        type: 'post',
        data: serializeCategories(),
        complete: function(){
          $('.paginated_collection').effect('highlight');
        }
      });
    }
  });
});
