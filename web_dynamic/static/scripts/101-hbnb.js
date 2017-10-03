const failed = '<div class="nope-container"><div><h1 class="nope">No Places Found.</h1><h3 class="nope">Maybe you just fail at life.</h3></div><img src="../static/images/rage-horror.svg" id="fail-img"></div>';

// Only load when document is ready
$(document).ready(function () {
  // Request API http://0.0.0.0:5001/api/v1/status/
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      $('div#api_status').toggleClass('available');
    }
  });

  // Creates stateObj
  let stateObj = {};

  // Binds a click event to the input tag for States
  $('div.locations ul.popover li h2 input').bind('click', function () {
    // Grabs attribute value from the input tag
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');

    // If input is checked, store attributes in the state object
    if ($(this).is(':checked')) {
      stateObj[id] = name;
    } else {
      delete stateObj[id];
    }
    locationArray(stateObj, cityObj);
  });

  // Creates cityObj
  let cityObj = {};

  // Binds a click event to the input tag for City
  $('div.locations ul.popover li input').bind('click', function () {
    // Grabs attribute value from the input tag
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');

    // If input is checked, store attributes in the city object
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

    // Clear the div
    $('div.locations h4').val('');

    // Replaces div with new array
    if (newLocationArray.length > 0) {
      $('div.locations h4').text(newLocationArray);
    } else {
      $('div.locations h4').text('\u00A0');
    }
  }

  // Creating amenity object
  let amenityObj = {};

  // Binds a click event to the input tag for Amenity
  $('div.amenities ul.popover li input').bind('click', function () {
    // Grabs attribute value from the input tag
    let id = $(this).attr('data-id');
    let name = $(this).attr('data-name');

    // If input is checked, store attributes in the amenity object
    if ($(this).is(':checked')) {
      amenityObj[id] = name;
    } else {
      delete amenityObj[id];
    }

    // Creates new array from amenity object
    let newAmenityArray = $.map(amenityObj, function (value) {
      return value;
    }).sort().join(', ');

    // Clear the div
    $('div.amenities h4').val(' ');

    // Replaces div with new array
    if (newAmenityArray.length > 0) {
      $('div.amenities h4').text(newAmenityArray);
    } else {
      $('div.amenities h4').text('\u00A0');
    }
  });

  // Helper compare function to natural sort names with alphanumerical and lower/uppercase
  function nameSort (a, b) {
    let name1 = a.name.toUpperCase();
    let name2 = b.name.toUpperCase();
    return name1.localeCompare(name2, undefined, { numeric: true, sensitivity: 'base' });
  }

  // Self invoking .get() for Users per Place
  let usersPerPlaceObj = {};
  (function getUsersPlace () {
    $.get('http://0.0.0.0:5001/api/v1/users/', {}).done(function (data) {
      for (let i = 0; i < data.length; i++) {
        usersPerPlaceObj[data[i].id] = data[i].first_name + ' ' + data[i].last_name;
      }
    });
  }());

  // Ajax call function for Places
  function ajaxCall (url, params = {}) {
    return $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(params),
      contentType: 'application/json; charset=utf-8',
      dataType: 'JSON'
    }).done(function (data) {
      data.sort(nameSort);

      // Empties out the place's section
      $('section.places').empty();

      if (data.length > 0) {
      // Goes through places data, appending places attributes/tags to the article
        for (let i = 0; i < data.length; i++) {
          let place = data[i];

        // Creates the article tags
          let article = $('<article>');

        // Variable with place's main info
          let placeInfo = $('<div>').append($('<div>', {class: 'price_by_night', text: '$' + place.price_by_night})).append($('<div>', {class: 'title'})).append($('<h2>', {text: place.name}));

        // Variable with place's icon information
          let placeIconInfo = '<div class="information"><div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + place.max_guest + ' Guests</div><div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + place.number_rooms + ' Bedrooms</div><div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + place.number_bathrooms + ' Bathroom</div></div>';

        // Appends all the place's icon's info to main place tag
          placeInfo.append(placeIconInfo);

        // If there description is null, set to empty string so null doesn't append
          if (!place.description) { place.description = ''; }

        // Variable with the place's description, appending to main place tag
          let placeOwnDescription = placeInfo.append($('<div>', {class: 'user'})).append($('<strong>', {text: 'Owner: ' + usersPerPlaceObj[place.user_id]})).append('<br />').append($('div', {class: 'description'})).append('<br />' + place.description);

        // Append place to the article, then append article to places section
          placeInfo.append(placeOwnDescription);

        // Creates Amenities object for each place
          let amenitiesPlace = {};

        // Get request to grab all amenities for each place
          $.get('http://0.0.0.0:5001/api/v1/places/' + place.id + '/amenities', {}).done(function (data) {
            for (let i = 0; i < data.length; i++) {
              amenitiesPlace[data[i].id] = data[i].name;
            }

          // Creates a new array with just the values of the amenities obj
            let amenityPerPlaceArray = $.map(amenitiesPlace, function (value) {
              return (value);
            });

          // Variable with the amenities' information
            let amenitiesInfo = $('<div>', {class: 'amenities'}).append($('<h2>', {text: 'Amenities'}));

          // Creates a ul tag
            let ulTag = $('<ul>');

          // Goes over each value in the amenities array created before, appends the value in an li tag to the ul tag
            $.each(amenityPerPlaceArray, function (index, value) {
              ulTag.append($('<li>', {text: value}));
            });

          // Appends the ul tag with list of amenities to amnenities information - then appends all amenities to the main place tag
            amenitiesInfo.append(ulTag);
            placeInfo.append(amenitiesInfo);
          });

        // Creates reviews objects based on a place
          let reviewsPlaceText = {};
          let reviewsPlaceDate = {};
          let reviewsPlaceUser = {};

        // Get request to grab all reviews for each place
          $.get('http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews', {}).done(function (data) {
            for (let i = 0; i < data.length; i++) {
              reviewsPlaceText[data[i].user_id] = data[i].text;

          // Creates new user object with all users in one review
              if (usersPerPlaceObj[data[i].user_id]) { reviewsPlaceUser[data[i].user_id] = usersPerPlaceObj[data[i].user_id]; }

            // Converts UTC time to long format, grabbing only Month, Date and Year. Ex: Mar 25 2017
              let dateString = new Date(data[i].created_at).toString().split(' ');
              dateString = dateString[1] + ' ' + dateString[2] + ' ' + dateString[3];

              reviewsPlaceDate[data[i].user_id] = dateString;
            }

          //
            let reviewsCount = data.length;

          // Variable with main review's information, append to div
            let reviewsInfo = $('<div>', {class: 'reviews'}).append($('<h2>', {text: reviewsCount + ' Reviews'}).append($('<span>', {text: 'Show'})));

          // Creates the ul tag with class toggle_reviews - allows user to toggle the reviews (show/hide)
            let ulTag = $('<ul>', {class: 'toggle_reviews'});

          // Initialize variable to put together each review
            let reviewer = '';
            let reviewDate = '';
            let review = '';

          // Array to store each review object
            let reviewArr = [];

          // Traverse over all the users in each review
            for (let key in reviewsPlaceUser) {
            // If the key matches, then create the object
              if (reviewsPlaceUser.hasOwnProperty(key) === reviewsPlaceDate.hasOwnProperty(key)) {
                reviewer = reviewsPlaceUser[key];
                reviewDate = reviewsPlaceDate[key];
                review = reviewsPlaceText[key];
              }
            // Push each review object to the review array
              reviewArr.push({'name': reviewer, 'text': review, 'date': reviewDate});
            }

          // Checks if place has at least one review
            if (reviewArr.length > 0) {
            // Traverse over the review array
              for (let i = 0; i < reviewArr.length; i++) {
              // Creates the user's info
                let userInfo = $('<h3>', {text: 'From ' + reviewArr[i].name + ' on ' + reviewArr[i].date});

              // Creates a wrap to wrap the reviewer's info in a li tag
                let userWrap = $('<li>');
                userWrap.append(userInfo);
                ulTag.append(userWrap);

              // Converts text in reviewsPlace to html
                let reviewsText = $('<p>').html(reviewArr[i].text);

              // Variable with the review's text, append to the ul tag
                let userReview = $(reviewsText);
                ulTag.append(userReview);
              }
            }

          // Append complete ul tag to reviews - then append to main place tag
            reviewsInfo.append(ulTag);
            placeInfo.append(reviewsInfo);
          });

        // Append the complete place tag to the article
          article.append(placeInfo);

        // Append complete article tag to the place's section
          $('section.places').append(article);
        }
      } else { $(failed).appendTo($('.places')); }
    });
  }

  // Show / Hide Reviews section
  $(document).on('click', 'div.reviews h2 span', function () {
    $(this).closest('div.reviews').find('ul.toggle_reviews').toggle();
    $(this).text($(this).text() === 'Show' ? 'Hide' : 'Show');
  });

// Ajax request for all Places
//  ajaxCall('http://0.0.0.0:5001/api/v1/places_search/');

// Ajax request for Places with selected Amenities, States, and Cities
  $('button').on('click', function () {
    ajaxCall('http://0.0.0.0:5001/api/v1/places_search/', {'amenities': amenityObj, 'states': stateObj, 'cities': cityObj});
  });
});
