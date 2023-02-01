<script lang="ts">
  import * as L from "leaflet";
  import { onMount } from "svelte";
  import "@geoman-io/leaflet-geoman-free";
  import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
  import "leaflet/dist/leaflet.css";
  const bg = new URL("$lib/floors/2floor.png", import.meta.url).href;
  const downloadIcon = new URL(
    "$lib/icons/controls/download.svg",
    import.meta.url
  ).href;
  const uploadIcon = new URL("$lib/icons/controls/upload.svg", import.meta.url)
    .href;
  const saveIcon = new URL("$lib/icons/controls/save.svg", import.meta.url)
    .href;
  import Notiflix from "notiflix";
  import { saveAs } from "file-saver";
  import Search from "$lib/icons/search.svg";
  import Icon from "../lib/Icon.svelte";
  // var equal = require('deep-equal');
  import equal from "deep-equal";

  var customGlobalRemovalMode = false;

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
      // maxBounds: bounds,
      attributionControl: false,
      renderer: L.svg()
    });
    map.pm.addControls({
      cutPolygon: true,
      download: true,
      dragMode: true,
      drawCircle: false,
      drawCircleMarker: false,
      drawMarker: false,
      drawPolygon: true,
      drawPolyline: true,
      drawRectangle: true,
      drawText: true,
      editMode: true,
      fullscreenControl: true,
      positions: {
        draw: "topleft",
        edit: "topleft",
        custom: "topright",
      },
      removalMode: true,
      rotateMode: true,
      // drawPolyline: false,

      // oneBlock: true,
      // snappingOption: true,
      // drawCircle: false,
    });

    map.pm.Toolbar.createCustomControl({
      name: "Remove layers",
      block: "edit",
      className: "leaflet-pm-icon-delete xyz-class",
      title: "Edit layers",
      afterClick: () => {
        map.pm.toggleGlobalEditMode();
      },
      toggle: true,
      actions: ["finishMode"],
    });

    // map.pm.Toolbar.createCustomControl({
    //   name: "saveLocalstorage",
    //   block: "edit",
    //   title: "save to local storage",
    //   className: `bg-[url('lib/icons/controls/saveLocalstorage.svg')]`,
    //   onClick() {
    //     map.pm.disableGlobalRemovalMode();
    //   },
    //   actions: ["finishMode"],
    // });

    // map.pm.Toolbar.createCustomControl({
    //   name: "asdf",
    //   block: "custom",
    //   title: "save to local storage",
    //   className: `bg-[url('lib/icons/controls/saveLocalstorage.svg')]`,
    //   onClick() {
    //     saveGeojson();
    //   },
    // });
    // map.pm.Toolbar.createCustomControl({
    //   name: "loadLocalstorage",
    //   block: "custom",
    //   title: "load from local storage",
    //   className: `bg-[url('lib/icons/controls/loadLocalstorage.svg')]`,
    //   onClick() {
    //     loadGeojsonFromLocalstorage();
    //   },
    // });
    // map.pm.Toolbar.createCustomControl({
    //   name: "download",
    //   block: "custom",
    //   title: "download file",
    //   className: `bg-[url('lib/icons/controls/download.svg')]`,
    //   onClick() {
    //     downloadGeojson();
    //   },
    // });
    // map.pm.Toolbar.createCustomControl({
    //   name: "loadGeojson",
    //   block: "custom",
    //   title: "load geojson from file",
    //   className: `bg-[url('lib/icons/controls/upload.svg')]`,
    //   onClick() {
    //     alert("loadGeojson");
    //   },
    // });
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

    //   // --------------------------------------------------
    //   // add buttons to map
    //   const customControl = L.Control.extend({
    //     // button position
    //     options: {
    //       position: "topright",
    //     },

    //     // method
    //     onAdd: function () {
    //       const array = [
    //         {
    //           title: "export features geojson",
    //           html: "<svg class='icon-geojson'><use xlink:href='#icon-export'></use></svg>",
    //           className: "export link-button leaflet-bar",
    //         },
    //         {
    //           title: "save geojson",
    //           html: "<svg class='icon-geojson'><use xlink:href='#icon-add'></use></svg>",
    //           className: "save link-button leaflet-bar",
    //         },
    //         {
    //           title: "remove geojson",
    //           html: "<svg class='icon-geojson'><use xlink:href='#icon-remove'></use></svg>",
    //           className: "remove link-button leaflet-bar",
    //         },
    //         {
    //           title: "load gejson from file",
    //           html: "<input type='file' id='geojson' class='geojson' accept='text/plain, text/json, .geojson' onchange='openFile(event)' /><label for='geojson'><svg class='icon-geojson'><use xlink:href='#icon-import'></use></svg></label>",
    //           className: "load link-button leaflet-bar",
    //         },
    //       ];

    //       const container = L.DomUtil.create(
    //         "div",
    //         "leaflet-control leaflet-action-button"
    //       );

    //       array.forEach((item) => {
    //         const button = L.DomUtil.create("a");
    //         button.href = "#";
    //         button.setAttribute("role", "button");

    //         button.title = item.title;
    //         button.innerHTML = item.html;
    //         button.className += item.className;

    //         // add buttons to container;
    //         container.appendChild(button);
    //       });

    //       return container;
    //     },
    //   });
    //   map.addControl(new customControl());

    //   // Drow polygon, circle, rectangle, polyline
    //   // --------------------------------------------------

    var drawnItems = L.featureGroup().addTo(map);

    // map.addControl(
    //   new L.Control.Draw({
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
    //   // let type = event.layerType;

    //   feature.type = feature.type || "Feature";
    //   // let props = (feature.properties = feature.properties || {});

    //   // props.type = type;

    //   // if (type === "circle") {
    //   //   props.radius = layer.getRadius();
    //   // }

    //   drawnItems.addLayer(layer);
    // });

    map.on("pm:create", (event) => {
      console.log(event);
      let layer = event.layer;
      drawnItems.addLayer(layer);
      setLayersStyle()
    });

    function setLayersStyle() {
      drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
          layer.on("mouseover", function (e) {
            // console.log(layer.className)
            // layer.setStyle({
            //   color: "red",
            //   opacity: 0,
            //   fillColor: "red",
            //   fillOpacity: 0.5,
            //   weight: 2,
            // });
            layer.setStyle({
              className: 'text-red-500 bg-red-500'
            })
            // layer._path.className = 'leaflet-interactive ';
            // layer._path.className += 'fill-red-500';
            layer._path.setAttribute('class', 'leaflet-interactive fill-red-500')
          });
          layer.on("mouseout", function (e) {
            // layer.setStyle({
            //   color: "black",
            //   opacity: 0,
            //   fillColor: "white",
            //   fillOpacity: 1,
            // });
            layer._path.setAttribute('class', 'leaflet-interactive fill-red-900')
          });
        }
      });
    }

    //   // --------------------------------------------------
    //   // download geojson to file

    //   function downloadGeojson() {
    //     const data = drawnItems.toGeoJSON();
    //     var fileToSave = new Blob([JSON.stringify(data)], {
    //       type: "application/json",
    //     });
    //     saveAs(fileToSave, "/lib/geojson/layout.json");
    //   }

    //   // --------------------------------------------------
    //   // save geojson to localstorage
    //   const saveJSON = document.querySelector(".save");

    function removeDuplicates(arr: any) {
      console.log(arr);
      const result = [];
      arr.forEach(function (item) {
        let duplicate = false;
        result.forEach(function (res) {
          if (equal(res, item)) {
            duplicate = true;
          }
        });
        if (!duplicate) {
          result.push(item);
        }
      });
      return result;
    }

    function saveGeojsonLS() {
      let gj = drawnItems.toGeoJSON() as any;
      let gjFeatures = (drawnItems.toGeoJSON() as any).features;

      if (Object.keys(gjFeatures).length === 0) {
        Notiflix.Notify.failure("You must have some data to save it");
        return;
      } else {
        Notiflix.Notify.success("The data has been saved to localstorage");
      }

      gj.features = removeDuplicates(gjFeatures);
      console.log(drawnItems);
      localStorage.setItem("geojson", JSON.stringify(gj));
    }

    //   // --------------------------------------------------
    //   // remove gojson from localstorage

    // const removeJSON = document.querySelector(".remove");

    // removeJSON.addEventListener("click", (e) => {
    //   e.preventDefault();
    //   localStorage.removeItem("geojson");

    //   Notiflix.Notify.info("All layers have been deleted");

    //   drawnItems.eachLayer(function (layer) {
    //     drawnItems.removeLayer(layer);
    //   });
    // });

    //   // --------------------------------------------------
    //   // load geojson from localstorage

    // function difference(a: any[], b: any[]) {
    //   // A comparer used to determine if two entries are equal.
    //   const isSameUser = (a, b) => equal(a, b);

    //   // Get items that only occur in the left array,
    //   // using the compareFunction to determine equality.
    //   const onlyInLeft = (left, right, compareFunction) =>
    //     left.filter(
    //       (leftValue) =>
    //         !right.some((rightValue) => compareFunction(leftValue, rightValue))
    //     );

    //   const onlyInA = onlyInLeft(a, b, isSameUser);
    //   const onlyInB = onlyInLeft(b, a, isSameUser);

    //   const result = [...onlyInA, ...onlyInB];
    //   return result;
    // }

    function onlyInA(a: any[], b: any[]) {
      // A comparer used to determine if two entries are equal.
      const isSameUser = (a, b) => equal(a, b);

      // Get items that only occur in the left array,
      // using the compareFunction to determine equality.
      const onlyInLeft = (left, right, compareFunction) =>
        left.filter(
          (leftValue) =>
            !right.some((rightValue) => compareFunction(leftValue, rightValue))
        );

      const onlyInA = onlyInLeft(a, b, isSameUser);

      return onlyInA;
    }

    function loadGeojsonLS() {
      const geojsonFromLocalStorage = JSON.parse(
        localStorage.getItem("geojson")
      ).features;
      const drawnGeojson = (drawnItems.toGeoJSON() as any).features || {};

      const newGeojson = onlyInA(geojsonFromLocalStorage, drawnGeojson);

      if (newGeojson) {
        setGeojsonToMap(newGeojson);
      }
    }

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
          // console.log((feature.geometry as any).coordinates.toString());
          drawnItems.addLayer(layer);
          const coordinates = (feature.geometry as any).coordinates.toString();
          const result = coordinates.match(/[^,]+,[^,]+/g);

          layer.bindPopup(
            "<span>Coordinates:<br>" + result.join("<br>") + "</span>"
          );
        },
      }).addTo(map);
      // map.flyToBounds(feature.getBounds());
    }

    //   // --------------------------------------------------
    //   // get geojson from file

    //   function openFile(event) {
    //     const input = event.target;

    //     const reader = new FileReader();
    //     reader.onload = function () {
    //       const result = reader.result as string;
    //       const geojson = JSON.parse(result);

    //       Notiflix.Notify.info("The data has been loaded from the file");

    //       setGeojsonToMap(geojson);
    //     };
    //     reader.readAsText(input.files[0]);
    //   }

    // map.on("click", function (e) {
    //   if (!map.pm.globalRemovalModeEnabled()) {
    //     console.log("click");
    //   }
    //   console.log(e)
    // });

    document
      .querySelector("#aDelete")
      .addEventListener("click", function (event) {
        event.preventDefault();
        customGlobalRemovalMode = !customGlobalRemovalMode;
        // console.log(localStorage.getItem("geojson"));

        const geojsonFromLocalStorage = JSON.parse(
          localStorage.getItem("geojson")
        ).features;
        // const drawnGeojson = (drawnItems.toGeoJSON() as any).features || {};
        console.log(geojsonFromLocalStorage);
        // localStorage.removeItem("geojson");

        // Notiflix.Notify.info("All layers have been deleted");

        // drawnItems.eachLayer(function (layer) {
        //   drawnItems.removeLayer(layer);
        // });

        drawnItems.eachLayer((layer) => {
          layer.on("click", function () {
            console.log(layer);
            // layer.remove();
            drawnItems.removeLayer(layer);
            // layer.removeFrom(map)
          });
        });

        // map.pm.toggleGlobalRemovalMode();
        // console.log("niggas");
      });

    // drawnItems.on("click", function (event) {
    //   console.log(event);
    //   drawnItems.removeLayer(event.layer);
    // });

    document
      .querySelector("#aSaveLS")
      .addEventListener("click", function (event) {
        event.preventDefault();
        saveGeojsonLS();
      });

    document
      .querySelector("#aLoadLS")
      .addEventListener("click", function (event) {
        event.preventDefault();
        loadGeojsonLS();
        console.log("aLoadLS");
      });

    // map.pm.addControls({ removalMode: false });

    loadGeojsonLS();
    setLayersStyle();
  });
</script>

<div id="map" class="w-[900px] h-[500px] !bg-white">
  <div class="absolute z-[1000] right-0">
    <div class="float-right  mr-[10px] mt-[10px]">
      <div class="border-[1.6px] rounded-[4px] bg-white">
        <a href="" id="aDelete">
          <div class="p-[5px] border-b-[1px]">
            <Icon
              name="Remove"
              class="w-[20px] h-[20px] text-orange-600"
              fill="currentColor"
            />
          </div>
        </a>
        <a href="" id="aSaveLS">
          <div class="p-[5px] border-b-[1px]">
            <Icon
              name="saveLs"
              class="w-[20px] h-[20px] text-orange-600"
              fill="currentColor"
            />
          </div>
        </a>
        <a href="" id="aLoadLS">
          <div class="p-[5px] border-b-[1px]">
            <Icon
              name="loadLs"
              class="w-[20px] h-[20px] text-orange-600"
              fill="currentColor"
            />
          </div>
        </a>
        <!-- <a href="" id="aSaveLS">
          <div class="p-[5px] border-b-[1px]">
            <Icon
              name="saveF"
              class="w-[20px] h-[20px] text-orange-600"
              fill="currentColor"
            />
          </div>
        </a>
        <a href="" id="aSaveLS">
          <div class="p-[5px]">
            <Icon
              name="loadF"
              class="w-[20px] h-[20px] text-orange-600"
              fill="currentColor"
            />
          </div>
        </a> -->
      </div>
    </div>
  </div>
</div>
<div>{customGlobalRemovalMode}</div>
