// Only load when document is ready
$(document).ready(function () {
  // Creates amenity object
  let amenityObj = {};

  // Binds a click event to input tag
  $('input').bind('click', function () {
    // Grabs attribute value from the input tag
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');

    // If input is checked, store attributes in the amenity object
    if ($(this).is(':checked')) {
      amenityObj[id] = name;
    } else {
      delete amenityObj[id];
    }

    // Creates new array from amenity objects values
    let newAmenityArray = $.map(amenityObj, function (value) {
      return value;
    }).join(', ');

    // Clear the div
    $('div.amenities h4').val('');

    // Replaces div with new array
    if (newAmenityArray.length > 0) {
      $('div.amenities h4').text(newAmenityArray);
    } else {
      $('div.amenities h4').text('\u00A0');
    }
  });

  // Request API http://0.0.0.0:5001/api/v1/status/
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
});
