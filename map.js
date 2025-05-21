const map = L.map('map').setView([40.73, -73.93], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; OpenStreetMap contributors'}).addTo(map);

L.marker([40.73, -73.93]).addTo(map).bindPopup("Central Point of NYC").openPopup();

const boroughColors = {
  "MANHATTAN": "#d62728",
  "BROOKLYN": "#1f77b4",
  "QUEENS": "#2ca02c",
  "BRONX": "#ff7f0e",
  "STATEN ISLAND": "#9467bd"
};

fetch('raw_data/accidents.geojson')
  .then(res => {
    if (!res.ok) throw new Error("fetch GeoJSON was unsuccessful");
    console.log("GeoJSON fetch was successful");
    return res.json();
  })
  .then(data => {
    console.log("GeoJSON data loaded:", data);

    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const borough = feature.properties.BOROUGH;
        return L.circleMarker(latlng, {
          radius: 4,
          fillColor: boroughColors[borough] || "#999",
          color: "#fff",
          weight: 0.5,
          fillOpacity: 0.8
        });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`Borough: ${feature.properties.BOROUGH}`);
      }
    }).addTo(map);
  })
  .catch(err => {
    console.error("GeoJSON fetch error:", err);
  });

const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Boroughs</h4>";
  for (const [borough, color] of Object.entries(boroughColors)) {
    div.innerHTML += `<i style="background: ${color}"></i> ${borough}<br>`;
  }
  return div;
};

legend.addTo(map);
