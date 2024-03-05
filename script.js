// access custom mapbox style 
mapboxgl.accessToken =  'pk.eyJ1IjoibWFobSIsImEiOiJjbHJiaTVkanowb3lzMndwcnYwN3ZleGJkIn0.6g4SedBzopOipcNKBKj3lg';

// create map object, and its characteristics upon loading 
const map = new mapboxgl.Map ({
    container: 'my-map',
    style: 'mapbox://styles/mahm/cls29mb1u01qn01o852ize7dt',
    center: [-85, 55], // coords upon load
    zoom: 3 // zoom upon load 
});

// once website is loaded, access the map object 
map.on('load', () => {
    // add data soruce from geojson
    map.addSource('airports-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/mahm44/lab2/main/airportPoints.geojson' // geojson hosted on github
        });

    // add a layer on the map using the point data from the geojson 
    map.addLayer({
        'id': 'airports-points',
        'type': 'circle', // for point data 
        'source': 'airports-data',
        'paint': {
            'circle-radius': ['/', ['get', 'aircraftMovement'], 20],
            'circle-color': '#007cbf'
        }
    });

    // add data source from mapbox vector tileset 
    map.addSource('airports-routes-data', { 
        'type': 'vector',
        'url': 'https://studio.mapbox.com/tilesets/mahm.3007dieb' // vector tileset link on mapbox 
        });
    map.addLayer({
        'id': 'routes', // cusotm layer ID
        'type': 'string', // for LineString data 
        'source': 'airports-routes-data', 
        'paint': {
            'stroke': '#88880', 
            'stroke-opacity': 1,
            'stroke-width': 3
        },
        'source-layer': 'airportRoutes-2sai4t' // layer name from mapbox 
    },
        'airports-data' // Drawing order - places layer below points
    );
}
) 

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "ca" 
    })
);

map.addControl(new mapboxgl.NavigationControl());

// changing size of airport markers based on aircraft movement 