mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: campsite.geometry.coordinates,
      zoom: 10
});

new mapboxgl.Marker()
    .setLngLat(campsite.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<h3>${campsite.title}</h3><p>${campsite.location}</p>`
            )
    )
    .addTo(map)