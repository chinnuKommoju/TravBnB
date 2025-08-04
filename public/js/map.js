  function initMap() {
    const location = { lat: lat, lng: lng };

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: location,
    });

    new google.maps.Marker({
      position: location,
      map: map,
    });
  }
