// amenities input
$(document).ready(function () {
  let amenity_ids = [];
  console.log("Amenity_ids: " + amenity_ids);
  $('input').change(function () {
    if (this.checked) {
      amenity_ids.push(:amenity_id);
      $('DIV.amenities.h4').append(:amenity_name);
      console.log("Push / Append: " + amenity_ids);
    } else {
      amenity_ids.splice($.inArray(:amenity_id, amenity_ids), 1);
      $('DIV.amenities.h4').detach(:amenity_name);
      console.log("Remove / Detach " + amenity_ids);
    }
  });
});
