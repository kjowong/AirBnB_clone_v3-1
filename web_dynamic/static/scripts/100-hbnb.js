// Connect Place and Amenity
$(document).ready(function () {
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
    locationArray(stateObj, cityObj);
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
    locationArray(stateObj, cityObj);
  });

  // Creates new array with values of stateObj and cityObj
  function locationArray (stateObj, cityObj) {
    let locationObj = Object.assign({}, stateObj, cityObj);
    let newLocationArray = $.map(locationObj, function (value) {
      return value;
    }).sort().join(', ');

    // clear the div
    $('div.locations h4').val('');

    // replaces div with new array
    if (newLocationArray.length > 0) {
      $('div.locations h4').text(newLocationArray);
    } else {
      $('div.locations h4').text('\u00A0');
    }
  }

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

    // Creates new array with values of amenityObj
    let newAmenityArray = $.map(amenityObj, function (value) {
      return value;
    }).sort().join(', ');

    // clear the div
    $('div.amenities h4').val(' ');

    // replaces div with new array
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

  // helper compare function to natural sort names with alphanumerical and lower/uppercase
  function nameSort (a, b) {
    let name1 = a.name.toUpperCase();
    let name2 = b.name.toUpperCase();
    return name1.localeCompare(name2, undefined, { numeric: true, sensitivity: 'base' });
  }

  // self invoking .get() for Users per Place
  let usersPerPlaceObj = {};
  (function getUsersPlace () {
    $.get('http://0.0.0.0:5001/api/v1/users/', {}).done(function (data) {
      for (let i = 0; i < data.length; i++) {
        usersPerPlaceObj[data[i].id] = data[i].first_name + ' ' + data[i].last_name;
      }
    });
  }());

  // ajax call function for Places
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
        let article = $('<article>');
        // variable with place's main info
        let placeInfo = $('<div>').append($('<div>', {class: 'price_by_night', text: '$' + place.price_by_night})).append($('<div>', {class: 'title'})).append($('<h2>', {text: place.name}));
        // variable with place's icon information
        let placeIconInfo = '<div class="information"><div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + place.max_guest + ' Guests</div><div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + place.number_rooms + ' Bedrooms</div><div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + place.number_bathrooms + ' Bathroom</div></div>';
        placeInfo.append(placeIconInfo);
        // variable with place's owner and description
        let placeOwnDescription = placeInfo.append($('<div>', {class: 'user'})).append($('<strong>', {text: 'Owner: ' + usersPerPlaceObj[place.user_id]})).append('<br />').append($('div', {class: 'description'})).append('<br />' + place.description);
        // append place to the article, then append article to places section
        placeInfo.append(placeOwnDescription);

        let amenitiesPlace = {};
        $.get('http://0.0.0.0:5001/api/v1/places/' + place.id + '/amenities', {}).done(function (data) {
          for (let i = 0; i < data.length; i++) {
            amenitiesPlace[data[i].id] = data[i].name;
          }
          let amenityPerPlaceArray = $.map(amenitiesPlace, function (value) {
            return (value);
          });
          let amenitiesInfo = $('<div>').append($('<h3>', {text: 'Amenities'}));
          let ulTag = $('<ul>');
          $.each(amenityPerPlaceArray, function (index, value) {
            ulTag.append($('<li>', {text: value}));
          });
          amenitiesInfo.append(ulTag);
          placeInfo.append(amenitiesInfo);
          article.append(placeInfo);
        });
        $('section.places').append(article);
      }
    });
  }

// ajax request for all Places
  ajaxCall('http://0.0.0.0:5001/api/v1/places_search/');

// ajax request for Places with selected Amenities, States, and Cities
  $('button').on('click', function () {
    ajaxCall('http://0.0.0.0:5001/api/v1/places_search/', {'amenities': amenityObj, 'states': stateObj, 'cities': cityObj});
  });
});
