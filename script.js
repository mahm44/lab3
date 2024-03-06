// access custom mapbox style 
mapboxgl.accessToken =  'pk.eyJ1IjoibWFobSIsImEiOiJjbHJiaTVkanowb3lzMndwcnYwN3ZleGJkIn0.6g4SedBzopOipcNKBKj3lg';
const button = document.getElementById("btn")

let btnID = null; 
// button functionality -- apply filter upon click, remove filter if clicked again 
button.addEventListener("click", function (){
    if (btnID !== true){
        btnID = true;
        // set filter to get points only with airfract movement less than 100000
        map.setFilter('airports-points', ['<', ['get', 'aircraftMovement'], 100000])
    }
    else{
        btnID = false;
        // if the button has already been pressed, clicking the button again will show all airports
        // (all airports have aircraft movement > 0, so all will be shown upon reclicking the button)
        map.setFilter('airports-points', ['>', ['get', 'aircraftMovement'], 0])
    }

})

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
        data: 'https://raw.githubusercontent.com/mahm44/lab3/main/airportPoints.geojson' // geojson hosted on github
        });

    // add a layer on the map using the point data from the geojson 
    map.addLayer({
        'id': 'airports-points',
        'type': 'circle', // for point data 
        'source': 'airports-data',
        'paint': {
            // change radius of symbol when zooming; make symbol radius a factor of aircraft movement
            'circle-radius': ['/', ['get', 'aircraftMovement'], 10500],
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

// zoom and scroll control 
map.addControl(new mapboxgl.NavigationControl());



// EVENTS - MOUSE CLICK
map.on('mouseenter', 'airports-points', () => {
    map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over provterr-fill layer
});

map.on('mouseleave', 'airports-points', () => {
    map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves provterr-fill layer
});


map.on('click', 'airports-points', (e) => {
    new mapboxgl.Popup() // upon clicking, declare a popup object 
        .setLngLat(e.lngLat) // method uses coordinates of mouse click to display popup at 
        // using popup, show the name of the airport / point that was cliked on 
        .setHTML("<b>Airport:</b> " + e.features[0].properties.name)
        .addTo(map); //Show popup on map
});
