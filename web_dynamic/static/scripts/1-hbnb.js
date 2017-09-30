// amenities input
$(document).ready(function () {
  let amenityObj = {};
  $('input').bind('click', function () {
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      amenityObj[id] = name;
    } else {
      delete amenityObj[id];
    }
    // clear the div
    console.log('empty', $('div.amenities h4').val(''));
    let newAmenityArray = $.map(amenityObj, function (value) {
	    return value;
    }).join(', ');
    console.log('new array', newAmenityArray);
    // replaces div with new array
    $('div.amenities h4').text(newAmenityArray);
  });
  console.log(amenityObj);
});
