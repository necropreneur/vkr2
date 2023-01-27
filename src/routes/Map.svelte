<script lang="ts">
  import * as L from "leaflet";
  import { onMount } from "svelte";
  import "@geoman-io/leaflet-geoman-free";
  import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
  import "leaflet/dist/leaflet.css";
  const bg = new URL("$lib/floors/2floor.png", import.meta.url).href;

  onMount(() => {
    const mapContainer = document.querySelector("#map") as HTMLElement;

    var bounds = L.latLngBounds([
      [0, 0],
      [875, 1251],
    ]);

    var map = L.map(mapContainer, {
      crs: L.CRS.Simple,
      // maxZoom: 2,
      minZoom: -10,
      maxZoom: 3,
      zoomSnap: 0,
      // zoomSnap: 1,
      zoomDelta: 0.3,
      maxBounds: bounds,
      attributionControl: false,
    });
    map.pm.addControls({
      position: 'topleft',
      // snappingOption: true,
      // drawCircle: false,
    })
    map.pm.setGlobalOptions({ snappable: false }); 

    var image = L.imageOverlay(bg, bounds).addTo(map);
    map.fitBounds(bounds);

    map.fitBounds(bounds);

    var currentZoom = map.getZoom();
    // console.log(currentZoom - 0.3)
    // map.setMinZoom(currentZoom - 0.3)
    // map.setZoom(currentZoom - 0.3)

    // const sol = L.latLng([145, 175]);
    // const marker = L.marker(sol).addTo(map);
  });
</script>

<div id="map" class="w-[900px] h-[500px] !bg-white" />

<!-- <img src={bg} alt=""> -->
