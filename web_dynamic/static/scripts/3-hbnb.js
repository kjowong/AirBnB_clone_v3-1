// Append Place to Article
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
    $('div.amenities h4').val('');
    let newAmenityArray = $.map(amenityObj, function (value) {
      return value;
    }).join(', ');
    // replaces div with new array
    $('div.amenities h4').text(newAmenityArray);
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
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    contentType: 'application/json; charset=utf-8',
    dataType: 'JSON'
  }).done(function (data) {
    for (let i = 0; i < data.length; i++) {
      let place = data[i];
      let placeHtml = '<article><div class="title"><h2>' + place.name + '</h2><div class="price_by_night">' + place.price_by_night + '</div></div><div class="information"><div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + place.max_guest + ' Guests</div><div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + place.number_rooms + ' Bedrooms</div><div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + place.number_bathrooms + ' Bathroom</div></div><div class="description">' + place.description + '</div></article>';
      $('section.places').append(placeHtml);
    }
  });
});
