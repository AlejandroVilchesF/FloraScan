<template>
    <div id="map"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import fullscreen from "leaflet.fullscreen";
import easybutton from "leaflet-easybutton";
import "leaflet.fullscreen/Control.FullScreen.css";

export default {
    data() {
        return {
            map: null,
            layerController: null,
            lat: 0,
            lng: 0,
            mapMarkers: []
        };
    },
    mounted() {
        this.initializeMap();
    },
    computed: {},
    watch: {},
    methods: {
        async initializeMap() {
            //Creacion de las capas del mapa
            let streets = L.tileLayer(
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }
            );

            //Inicializamos el mapa con la capa satélite como predeterminada y creamos el renderer en canvas para poder controlar la torlerancia
            this.map = await L.map("map", {
                layers: [streets],
                center: [40.333333, -4.187500],
                zoom: 5,
                zoomControl: false,
                fadeAnimation: true,
                attributionControl: true
            });

            let baseMaps = {
                "Predeterminado": streets
            };

            this.layerController = await L.control.layers(baseMaps, null, { collapsed: true, position: "bottomright" }).addTo(this.map)
            //Botones de zoom personalizados
            L.control
                .zoom({
                    zoomInTitle: "Acercar",
                    zoomOutTitle: "Alejar",
                })
                .addTo(this.map);

            //Boton de pantalla completa
            L.control
                .fullscreen({
                    position: "topleft",
                    title: "Pantalla completa",
                    titleCancel: "Salir de Pantalla Completa",
                    content: null,
                    forceSeparateButton: false,
                    forcePseudoFullscreen: false,
                    fullscreenElement: false,
                })
                .addTo(this.map);

            //Evento para obtener las coordenadas al hacer click
            if (this.$route.name == "contribuir") {
                this.map.on('click', (e) => {
                    const { lat, lng } = e.latlng;
                    this.lat = lat;
                    this.lng = lng;
                    // Emitir evento para enviar las coordenadas al componente padre
                    this.$emit("mapClick");
                    //Creacion de marcador para mostrar el lugar del click
                    this.newMarker(lat, lng);
                });
            }
        },
        newMarker(lat, lng) {
            this.removeMarkers();
            let myIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            let marker = L.marker([lat, lng], { icon: myIcon }).addTo(this.map);
            this.mapMarkers.push(marker);
        },
        removeMarkers() {
            this.mapMarkers.forEach(el => { this.map.removeLayer(el) });
        },
        contributionMarkers(coordinates) {
            let myIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            coordinates.forEach(el => {
                L.marker([el.latitud, el.longitud], { icon: myIcon }).addTo(this.map);
            });
        },
        formatDate(isoDate){
            const date = new Date(isoDate);

            const day = date.getUTCDate();
            const month = date.getUTCMonth() + 1;
            const year = date.getUTCFullYear();

            const formattedDay = String(day).padStart(2, '0');
            const formattedMonth = String(month).padStart(2, '0');

            const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

            return formattedDate;
        }
    }
};
</script>

<style scoped>
#map {
    height: 100%;
    width: 100%;
}

#map:hover {
    cursor: pointer;
}
</style>