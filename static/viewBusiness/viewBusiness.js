let mapBoxToken, theme;
let longitude,latitude;
let userlong, userlat;

function setter(to,th,lo,la,ulo,ula){
    mapBoxToken = to;
    theme = th;
    longitude = lo;
    latitude = la;
    userlong = ulo;
    userlat = ula;
}

function setCoords(map){
    let marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat([userlong,userlat])
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("You"))
    .addTo(map);
}

$(document).ready(function() {
    document.querySelector("#business .carousel-inner").firstElementChild.classList.add("active");
    $("#grantLocation").modal();
    function getLocation(){
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(successfulLookup, denial, {enableHighAccuracy: true});
        }
    }
    getLocation();

    // mapboxgl.accessToken = token;
    // let map = new mapboxgl.Map({
    //     container: 'map',
    //     center: [75.857727, 22.719568],
    //     zoom: 2.5,
    //     style: (theme=="light")?'mapbox://styles/mapbox/streets-v11':'mapbox://styles/mapbox/dark-v10',
    // });
    // map.on('idle',function(){
    //     map.resize()
    // })
    // const checkbox2 = document.getElementById('checkbox');
    // checkbox2.addEventListener('change', ()=>{
    //     if($('#checkbox').prop('checked')){
    //         mapboxgl.accessToken = token;
    //         map = new mapboxgl.Map({
    //             container: 'map',
    //             center: [75.857727, 22.719568],
    //             zoom: 2.5,
    //             style: 'mapbox://styles/mapbox/dark-v10',
    //         });
    //     }
    //     else{
    //         mapboxgl.accessToken = token;
    //         map = new mapboxgl.Map({
    //             container: 'map',
    //             center: [75.857727, 22.719568],
    //             zoom: 2.5,
    //             style: 'mapbox://styles/mapbox/streets-v11',
    //         });
    //     }
    //     getLocation();
    // })
    
    function successfulLookup(position){
        // const { latitude, longitude } = position.coords;
        mapboxgl.accessToken = mapBoxToken;

        let map = new mapboxgl.Map({
            container: 'map',
            center: [longitude,latitude],
            zoom: 12.5,
            style: (theme=="light")?'mapbox://styles/mapbox/streets-v11':'mapbox://styles/mapbox/dark-v10',
        });
        // map.on('idle',function(){
        //     map.resize()
        // })
        const checkbox2 = document.getElementById('checkbox');
        checkbox2.addEventListener('change', ()=>{
            $('#map').empty();
            if($('#checkbox').prop('checked')){
                mapboxgl.accessToken = mapBoxToken;
                map = new mapboxgl.Map({
                    container: 'map',
                    center: [longitude,latitude],
                    zoom: 12.5,
                    style: 'mapbox://styles/mapbox/dark-v10',
                });
            }
            else{
                mapboxgl.accessToken = mapBoxToken;
                map = new mapboxgl.Map({
                    container: 'map',
                    center: [longitude,latitude],
                    zoom: 12.5,
                    style: 'mapbox://styles/mapbox/streets-v11',
                });
            }
            const marker1 = new mapboxgl.Marker({ color: 'black' })
            .setLngLat([longitude, latitude])
            .addTo(map);
            setCoords(map);
            // getLocation();
        })
        const marker1 = new mapboxgl.Marker({ color: 'black' })
        .setLngLat([longitude, latitude])
        .addTo(map);
        setCoords(map);
    }
    function denial(position){
        var myModal = new bootstrap.Modal(document.getElementById('grantLocation'), {
            keyboard: false
        })
        myModal.show()
        setInterval(() => {
            navigator.permissions.query({name:'geolocation'}).then(function(result) {
            if (result.state === 'granted') {
                myModal.hide()
                getLocation()
            }
            });
        }, 1000);
    }
});
