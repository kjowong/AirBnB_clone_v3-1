// Connect Place and Amenity
$(document).ready(function () {
  // Creating location, state, and city objects with id and name
  // Creates stateObj
  let stateObj = {};
  $('div.locations ul.popover li h2 input').bind('click', function () {
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      stateObj[id] = name;
    } else {
      delete stateObj[id];
    }

    // clear the div
    $('div.locations h4').val('');

    // Creates new array with values of stateObj and cityObj
    let locationObj = Object.assign({}, stateObj, cityObj);
    let newLocationArray = $.map(locationObj, function (value) {
      return value;
    }).sort().join(', ');

    // replaces div with new array
    $('div.locations h4').text(newLocationArray);
  });

  // Creates cityObj
  let cityObj = {};
  $('div.locations ul.popover li input').bind('click', function () {
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      cityObj[id] = name;
    } else {
      delete cityObj[id];
    }

    // clear the div
    $('div.locations h4').val('');

    // Creates new array with values of stateObj and cityObj
    let locationObj = Object.assign({}, stateObj, cityObj);
    let newLocationArray = $.map(locationObj, function (value) {
      return value;
    }).sort().join(', ');

    // replaces div with new array
    $('div.locations h4').text(newLocationArray);
  });

  // Creating amenity object with id and name
  let amenityObj = {};
  $('div.amenities ul.popover li input').bind('click', function () {
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      amenityObj[id] = name;
    } else {
      delete amenityObj[id];
    }
    // clear the div
    $('div.amenities h4').val('');

    // Creates new array with values of amenityObj
    let newAmenityArray = $.map(amenityObj, function (value) {
      return value;
    }).sort().join(', ');
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

  // function to sort names of place properly
  function nameSort (a, b) {
    let name1 = a.name.toUpperCase();
    let name2 = b.name.toUpperCase();
    return name1.localeCompare(name2, undefined, { numeric: true, sensitivity: 'base' });
  }

  // ajax call function
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
	let name = '';
	$.ajax({
	  type: 'GET',
	  url: 'http://0.0.0.0:5001/api/v1/users/' + place.user_id,
	  data: JSON.stringify({}),
	  contentType: 'application/json; charset=utf-8',
	  dataType: 'JSON'
	}).done(function (data) {
	  console.log("User Data: " + data);
	  name = data.first_name + ' ' +  data.last_name;
	  console.log("Name: " + name);
          let placeHtml = '<article><div class="title-wrapper"><div class="price_by_night">$' + place.price_by_night + '</div><div class="title"><h2>' + place.name + '</h2></div></div><div class="information"><div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + place.max_guest + ' Guests</div><div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + place.number_rooms + ' Bedrooms</div><div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + place.number_bathrooms + ' Bathroom</div></div><div class="user"><strong>Owner: ' + name + '</strong></div><div class="description"><br />' + place.description + '</div></article>';
          $('section.places').append(placeHtml);
	});
      }
    });
  }

// Post Places http://0.0.0.0:5001/api/v1/places_search/
  ajaxCall('http://0.0.0.0:5001/api/v1/places_search/');

// Post Places + Amenities + States + Cities
  $('button').on('click', function () {
    ajaxCall('http://0.0.0.0:5001/api/v1/places_search/', {'amenities': amenityObj, 'states': stateObj, 'cities': cityObj});
  });
});
