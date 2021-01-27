// Query URL for week's earthquakes data (url from HW readme)
eqLink = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
// Get request to query URL
d3.json(eqLink).then((data) => {
    // Send data object to features
    createFeatures(data.features);
    console.log(data.features);
});

function createFeatures(eqData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup('<h4>Place: ' + feature.properties.place + '</h4><h4>Date: ' + new Date(feature.properties.time) + '</h4><h4>legendColor: ' + feature.properties.mag + '</h4><h4>USGS Event Page: <a href=' + feature.properties.url + " target='_blank'>Click here</a></h4>", { maxWidth: 400 })
    }

    LayerMap = L.geoJSON(eqData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            let radius = feature.properties.mag * 4.5;

            if (feature.properties.mag > 5) {
                fillcolor = 'Crimson';
            } else if (feature.properties.mag >= 4) {
                fillcolor = 'LightCoral';
            } else if (feature.properties.mag >= 3) {
                fillcolor = 'Orange';
            } else if (feature.properties.mag >= 2) {
                fillcolor = 'Gold';
            } else if (feature.properties.mag >= 1) {
                fillcolor = 'PaleGreen';
            } else fillcolor = 'SpringGreen';

            return L.circleMarker(latlng, {
                radius: radius,
                color: 'black',
                fillColor: fillcolor,
                fillOpacity: 0.7,
                weight: 0.7
            });
        }
    });
    createMap(LayerMap);
}

function createMap(earthquakes) {
    // Assign the different mapbox styles
    satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox/satellite-v9',
        accessToken: API_KEY
    });
    streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox/streets-v11',
        accessToken: API_KEY
    });
    outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox/outdoors-v11',
        accessToken: API_KEY
    });
    light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox/light-v10',
        accessToken: API_KEY
    });
    dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 20,
        id: 'mapbox/dark-v10',
        accessToken: API_KEY
    });
    mapTheme = {
        'Satellite': satellite,
        'Streets': streets,
        'Outdoors': outdoors,
        'Light': light,
        'Dark': dark
    };

    overlay = {
        earthquakes: earthquakes
    };

    // Set view-Center Willis Tower
    myMap = L.map('map', {
        center: [41.87884, -87.63597],
        zoom: 4,
        layers: [satellite, earthquakes]
    });

    L.control.layers(mapTheme, overlay, {
        collapsed: false
    }).addTo(myMap);

    // Assign colors for legend/markers
    function getColor(legendColor) {
        if (legendColor > 5) {
            return 'Crimson'
        } else if (legendColor > 4) {
            return 'LightCoral'
        } else if (legendColor > 3) {
            return 'Orange'
        } else if (legendColor > 2) {
            return 'Gold'
        } else if (legendColor > 1) {
            return 'PaleGreen'
        } else {
            return 'SpringGreen'
        }
    };
    legend = L.control({ position: 'topright' });
    legend.onAdd = function(myMap) {
        div = L.DomUtil.create('div', 'info legend')
        legendColors = [0, 1, 2, 3, 4, 5]
        labels = []

        for (let i = 0; i < legendColors.length; i++) {
            div.innerHTML +=
                '<color style="background:' + getColor(legendColors[i] + 1) + '"></color>' + legendColors[i] + (legendColors[i + 1] ? '&ndash;' + legendColors[i + 1] + '<br>' : '+');
        }
        return div
    };
    legend.addTo(myMap);

}