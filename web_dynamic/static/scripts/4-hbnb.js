// Only load when document is ready
$(document).ready(function () {
  // Creating amenity object
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

    // Creates new array from amenity object values
    let newAmenityArray = $.map(amenityObj, function (value) {
      return value;
    }).sort().join(', ');

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

  // Helper compare function to natural sort names with alphanumerical and lower/uppercase
  function nameSort (a, b) {
    let name1 = a.name.toUpperCase();
    let name2 = b.name.toUpperCase();
    return name1.localeCompare(name2, undefined, { numeric: true, sensitivity: 'base' });
  }

  // Ajax call function for Places
  function ajaxCall (url, params = {}) {
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(params),
      contentType: 'application/json; charset=utf-8',
      dataType: 'JSON'
    }).done(function (data) {
      data.sort(nameSort);
      $('section.places').empty();
      for (let i = 0; i < data.length; i++) {
        let place = data[i];

        // If there description is null, set to empty string so null doesn't append
        if (!place.description) { place.description = ''; }

        let placeHtml = '<article><div class="title-wrapper"><div class="price_by_night">$' + place.price_by_night + '</div><div class="title"><h2>' + place.name + '</h2></div></div><div class="information"><div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + place.max_guest + ' Guests</div><div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + place.number_rooms + ' Bedrooms</div><div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + place.number_bathrooms + ' Bathroom</div></div><div class="description"><br />' + place.description + '</div></article>';
        $('section.places').append(placeHtml);
      }
    });
  }

// Post Places http://0.0.0.0:5001/api/v1/places_search/
  ajaxCall('http://0.0.0.0:5001/api/v1/places_search/');

// Post Places + Amenities
  $('button').on('click', function () {
    ajaxCall('http://0.0.0.0:5001/api/v1/places_search/', {'amenities': amenityObj});
  });
});
