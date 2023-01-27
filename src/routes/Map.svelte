<script lang="ts">
  import * as L from "leaflet";
  import { onMount } from "svelte";
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
      maxZoom: 0,
      zoomSnap: 0,
      // zoomSnap: 1,
      // zoomDelta: 0.5,
      maxBounds: bounds,
      attributionControl: false,
    });

    
    // map.setMinZoom(currentZoom);
    

    var image = L.imageOverlay(bg, bounds).addTo(map);
    console.log(bg);
    map.fitBounds(bounds);

    // var boundsImg = L.latLngBounds([
    //   [0, 0],
    //   [2000, 2000],
    // ]);

    var wantedZoom = map.getBoundsZoom(bounds, true);
    var center = bounds.getCenter();
    // map.setZoom(-1);
    // map.setView([0, 0]);
    map.fitBounds(bounds);

    var currentZoom = map.getZoom()
    map.setMinZoom(currentZoom)
    console.log(currentZoom)
    // const sol = L.latLng([145, 175]);
    // const marker = L.marker(sol).addTo(map);
  });
</script>

<div id="map" class="w-[600px] h-[300px]" />

<!-- <img src={bg} alt=""> -->
