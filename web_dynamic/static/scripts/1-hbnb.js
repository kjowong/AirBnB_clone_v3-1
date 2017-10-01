// Only load when document is ready
$(document).ready(function () {
  // Creates amenity object
  let amenityObj = {};

  // Binds a click event to input tag
  $('input').bind('click', function () {
    // Grabs attribute value from the input tag
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');

    // If the checkbox is checked, store attributes in the amenity object
    if ($(this).is(':checked')) {
      amenityObj[id] = name;
    } else {
      delete amenityObj[id];
    }

    // Clear the div
    $('div.amenities h4').val('');

    // Creates new array from amenity objects values
    let newAmenityArray = $.map(amenityObj, function (value) {
      return value;
    }).sort().join(', ');

    // Replaces div with new array
    $('div.amenities h4').text(newAmenityArray);
  });
});
