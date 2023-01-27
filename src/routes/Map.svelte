<script lang="ts">
  import * as L from "leaflet";
  import { onMount } from "svelte";
  import "@geoman-io/leaflet-geoman-free";
  import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
  import "leaflet/dist/leaflet.css";
  const bg = new URL("$lib/floors/2floor.png", import.meta.url).href;
  import Notiflix from "notiflix";

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
      position: "topleft",
      fullscreenControl: true,
      // snappingOption: true,
      // drawCircle: false,
    });
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

    // --------------------------------------------------
    // Nofiflix options

    Notiflix.Notify.init({
      width: "280px",
      position: "right-bottom",
      distance: "10px",
    });

    // --------------------------------------------------
    // add buttons to map
    const customControl = L.Control.extend({
      // button position
      options: {
        position: "topright",
      },

      // method
      onAdd: function () {
        const array = [
          {
            title: "export features geojson",
            html: "<svg class='icon-geojson'><use xlink:href='#icon-export'></use></svg>",
            className: "export link-button leaflet-bar",
          },
          {
            title: "save geojson",
            html: "<svg class='icon-geojson'><use xlink:href='#icon-add'></use></svg>",
            className: "save link-button leaflet-bar",
          },
          {
            title: "remove geojson",
            html: "<svg class='icon-geojson'><use xlink:href='#icon-remove'></use></svg>",
            className: "remove link-button leaflet-bar",
          },
          {
            title: "load gejson from file",
            html: "<input type='file' id='geojson' class='geojson' accept='text/plain, text/json, .geojson' onchange='openFile(event)' /><label for='geojson'><svg class='icon-geojson'><use xlink:href='#icon-import'></use></svg></label>",
            className: "load link-button leaflet-bar",
          },
        ];

        const container = L.DomUtil.create(
          "div",
          "leaflet-control leaflet-action-button"
        );

        array.forEach((item) => {
          const button = L.DomUtil.create("a");
          button.href = "#";
          button.setAttribute("role", "button");

          button.title = item.title;
          button.innerHTML = item.html;
          button.className += item.className;

          // add buttons to container;
          container.appendChild(button);
        });

        return container;
      },
    });
    map.addControl(new customControl());

    // Drow polygon, circle, rectangle, polyline
    // --------------------------------------------------

    var drawnItems = L.featureGroup().addTo(map);

    // map.addControl(
    //   new L.Control.({
    //     edit: {
    //       featureGroup: drawnItems,
    //       poly: {
    //         allowIntersection: false,
    //       },
    //     },
    //     draw: {
    //       polygon: {
    //         allowIntersection: false,
    //         showArea: true,
    //       },
    //     },
    //   })
    // );

    // map.on(L.Draw.Event.CREATED, function (event) {
    //   let layer = event.layer;
    //   let feature = (layer.feature = layer.feature || {});
    //   let type = event.layerType;

    //   feature.type = feature.type || "Feature";
    //   let props = (feature.properties = feature.properties || {});

    //   props.type = type;

    //   if (type === "circle") {
    //     props.radius = layer.getRadius();
    //   }

    //   drawnItems.addLayer(layer);
    // });

    map.on("pm:create", (event) => {
      console.log(event);
      let layer = event.layer;
      drawnItems.addLayer(layer);
    });

    // --------------------------------------------------
    // save geojson to file

    const exportJSON = document.querySelector(".export");

    exportJSON.addEventListener("click", () => {
      // Extract GeoJson from featureGroup
      const data = drawnItems.toGeoJSON();

      // if (data.features.length === 0) {
      //   Notiflix.Notify.failure(
      //     "You must have some data to save a geojson file"
      //   );
      //   return;
      // } else {
      //   Notiflix.Notify.info("You can save the data to a geojson");
      // }

      // Stringify the GeoJson
      const convertedData =
        "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

      exportJSON.setAttribute("href", "data:" + convertedData);
      exportJSON.setAttribute("download", "data.geojson");
    });

    // --------------------------------------------------
    // save geojson to localstorage
    const saveJSON = document.querySelector(".save");

    saveJSON.addEventListener("click", (e) => {
      e.preventDefault();

      const data = drawnItems.toGeoJSON();

      // if (data.features.length === 0) {
      //   Notiflix.Notify.failure("You must have some data to save it");
      //   return;
      // } else {
      //   Notiflix.Notify.success("The data has been saved to localstorage");
      // }

      localStorage.setItem("geojson", JSON.stringify(data));
    });

    // --------------------------------------------------
    // remove gojson from localstorage

    const removeJSON = document.querySelector(".remove");

    removeJSON.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("geojson");

      Notiflix.Notify.info("All layers have been deleted");

      drawnItems.eachLayer(function (layer) {
        drawnItems.removeLayer(layer);
      });
    });

    // --------------------------------------------------
    // load geojson from localstorage

    const geojsonFromLocalStorage = JSON.parse(localStorage.getItem("geojson"));

    function setGeojsonToMap(geojson) {
      const feature = L.geoJSON(geojson, {
        style: function (feature) {
          return {
            color: "red",
            weight: 2,
          };
        },
        pointToLayer: (feature, latlng) => {
          if (feature.properties.type === "circle") {
            return L.circle(latlng, {
              radius: feature.properties.radius,
            });
          } else if (feature.properties.type === "circlemarker") {
            return L.circleMarker(latlng, {
              radius: 10,
            });
          } else {
            return new L.Marker(latlng);
          }
        },
        onEachFeature: function (feature, layer) {
          drawnItems.addLayer(layer);
          const coordinates = feature.geometry.bbox.toString();
          const result = coordinates.match(/[^,]+,[^,]+/g);

          layer.bindPopup(
            "<span>Coordinates:<br>" + result.join("<br>") + "</span>"
          );
        },
      }).addTo(map);

      map.flyToBounds(feature.getBounds());
    }

    if (geojsonFromLocalStorage) {
      setGeojsonToMap(geojsonFromLocalStorage);
    }

    // --------------------------------------------------
    // get geojson from file

    function openFile(event) {
      const input = event.target;

      const reader = new FileReader();
      reader.onload = function () {
        const result = reader.result as string;
        const geojson = JSON.parse(result);

        Notiflix.Notify.info("The data has been loaded from the file");

        setGeojsonToMap(geojson);
      };
      reader.readAsText(input.files[0]);
    }
  });
</script>

<svg xmlns="http://www.w3.org/2000/svg" style="display: none">
  <symbol id="icon-export" viewBox="0 0 24 24">
    <path
      d="M0 12c0 6.627 5.373 12 12 12s12-5.373 12-12S18.627 0 12 0 0 5.373 0 12zm17-1h-4v8h-2v-8H7l5-6 5 6z"
    />
  </symbol>
  <symbol id="icon-add" viewBox="0 0 24 24">
    <path
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z"
    />
  </symbol>
  <symbol id="icon-remove" viewBox="0 0 24 24">
    <path
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 13H6v-2h12v2z"
    />
  </symbol>
  <symbol id="icon-import" viewBox="0 0 24 24">
    <path
      d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12zM7 13h4V5h2v8h4l-5 6-5-6z"
    />
  </symbol>
</svg>
<div id="map" class="w-[900px] h-[500px] !bg-white" />

<!-- <img src={bg} alt=""> -->
<style>
  /* *,
  :after,
  :before {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html {
    height: 100%;
  }

  body,
  html,
  #map {
    width: 100%;
    height: 100%;
  }

  body {
    position: relative;
    min-height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    margin: 0;
    padding: 0;
    background-color: #f1f1f1;
  }

  .link-button label {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    width: 110%;
  }

  .leaflet-touch .link-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 34px;
    background: #fff;
    margin-bottom: 5px;
    padding: 5px;
  }

  .link-button:hover {
    background-color: #f4f4f4;
    fill: #a200ff;
  }

  .link-button:hover:after {
    position: absolute;
    display: flex;
    justify-content: end;
    content: attr(title);
    right: 40px;
    width: auto;
    white-space: nowrap;
    background: #fff;
    padding: 5px;
  }

  .geojson {
    display: none;
  }

  input[type="file"] {
    font-size: 0;
  }
  ::file-selector-button {
    font-size: initial;
  }

  .icon-geojson {
    width: 25px;
    height: 25px;
  } */
</style>
