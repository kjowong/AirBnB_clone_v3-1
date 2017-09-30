// Request API http://0.0.0.0:5001/api/v1/status/
$(document).ready(function () {
  let amenityIds = [];
  let amenityNames = [];
  $('input').bind('click', function () {
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      amenityIds.push(id);
      amenityNames.push(name);
      $('div.amenities h4').text(amenityNames.sort().join(', '));
    } else {
      amenityIds.splice($.inArray(id, amenityIds), 1);
      amenityNames.splice($.inArray(name, amenityNames), 1);
      $('div.amenities h4').text(amenityNames.sort().join(', '));
    }
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
});
