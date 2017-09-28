// amenities input
$(document).ready(function () {
  let amenityIds = [];
  let amenityNames = [];
  $('input').bind('click', function () {
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      let idList = amenityIds.push(id);
      let nameList = amenityNames.push(name);
      $('DIV.amenities h4').text(amenityNames.sort().join(', '));
    } else {
      amenityIds.splice($.inArray(id, amenityIds), 1);
      amenityNames.splice($.inArray(name, amenityNames), 1);
      $('DIV.amenities h4').text(amenityNames.sort().join(', '));
    }
  });
});
