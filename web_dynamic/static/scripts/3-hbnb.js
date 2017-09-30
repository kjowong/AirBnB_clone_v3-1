// Amenity drop downs
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

  // Request API http://0.0.0.0:5001/api/v1/status/
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  // Post Places http://0.0.0.0:5001/api/v1/places_search/
  let request = { 'Content-Type': 'application/json', 'data': {} };
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify(request),
    contentType: 'application/json; charset=utf-8',
    dataType: 'JSON'
  }).done(function (data) {
    for (let i = 0; i < data.length; i++) {
      let place = data[i];
      let placeHtml = '<article><div class="title"><h2>' + place.name + '</h2><div class="price_by_night">' + place.price_by_night + '</div></div><div class="information"><div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + place.max_guest + ' Guests</div><div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + place.number_rooms + ' Bedrooms</div><div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + place.number_bathrooms + ' Bathroom</div></div><div class="description">' + place.description + '</div></article>'
      $('section.places').append(placeHtml);
    }
  });
});
