<script lang="ts">
  import * as L from 'leaflet';
  import { onMount } from 'svelte';
  import '@geoman-io/leaflet-geoman-free';
  import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
  import 'leaflet/dist/leaflet.css';
  // const bg = new URL("$lib/floors/2floor.png", import.meta.url).href;
  const bg = new URL('$lib/floors/new_floor.svg', import.meta.url).href;
  const downloadIcon = new URL('$lib/icons/controls/download.svg', import.meta.url).href;
  const uploadIcon = new URL('$lib/icons/controls/upload.svg', import.meta.url).href;
  const saveIcon = new URL('$lib/icons/controls/save.svg', import.meta.url).href;
  import Notiflix from 'notiflix';
  import { saveAs } from 'file-saver';
  import Icon from '../lib/Icon.svelte';
  // var equal = require('deep-equal');
  import equal from 'deep-equal';
  import 'leaflet.fullscreen/Control.FullScreen.js';
  import 'leaflet.fullscreen/Control.FullScreen.css';

  // import { DateInput } from 'date-picker-svelte';
  import { Datepicker } from 'flowbite-svelte';

  class Table {
    constructor(
      public necessary_equipment: string = '',
      public permanent_visit: boolean = false,
      public dateFrom: Date = new Date(),
      public dateTo: Date = new Date(),
    ) {}
  }

  let tables: { [key: number]: Table } = {
    0: new Table(),
    1: new Table(),
  };

  var customGlobalRemovalMode = false;
  var fullscreen: boolean = true;

  const COLORS = {
    EMPTY: '#303030',
    EMPTY_HOVER: '#474747',
  };

  let current_table_id: number = 0;

  // function updateBoundVal() {
  //   current_table_id
  // }

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/datepicker.min.js';
    script.async = true;
    document.head.appendChild(script);

    const mapContainer = document.querySelector('#map') as HTMLElement;

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
      renderer: L.svg(),

      // fullscreenControl: true,
      // fullscreenControlOptions: {
      //   position: "topleft",
      // },
    });
    L.control
      .fullscreen({
        position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, default topleft
        title: 'Show me the fullscreen !', // change the title of the button, default Full Screen
        titleCancel: 'Exit fullscreen mode', // change the title of the button when fullscreen is on, default Exit Full Screen
        content: null, // change the content of the button, can be HTML, default null
        forceSeparateButton: true, // force separate button to detach from zoom buttons, default false
        forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
        fullscreenElement: false, // Dom element to render in full screen, false by default, fallback to map._container
      })
      .addTo(map);

    map.pm.addControls({
      cutPolygon: true,
      download: true,
      dragMode: true,
      drawCircle: false,
      drawCircleMarker: false,
      drawMarker: true,
      drawPolygon: true,
      drawPolyline: true,
      drawRectangle: true,
      drawText: true,
      editMode: true,
      positions: {
        draw: 'topleft',
        edit: 'topleft',
        custom: 'topright',
      },
      removalMode: true,
      rotateMode: true,
      // drawPolyline: false,

      // oneBlock: true,
      // snappingOption: true,
      // drawCircle: false,
    });

    // map.pm.Toolbar.createCustomControl({
    //   name: "Remove layers",
    //   block: "edit",
    //   className: "leaflet-pm-icon-delete xyz-class",
    //   title: "Edit layers",
    //   afterClick: () => {
    //     map.pm.toggleGlobalEditMode();
    //   },
    //   toggle: true,
    //   actions: ["finishMode"],
    // });

    // map.addControl(
    //   new L.Control.Fullscreen({
    //     title: {
    //       false: "View Fullscreen",
    //       true: "Exit Fullscreen",
    //     },
    //   })
    // );

    // L.control
    //   .fullscreen({
    //     position: "bottomright",
    //     title: "Plein écran",
    //     titleCancel: "Quitter le mode plein écran",
    //     content: null,
    //   })
    //   .addTo(map);

    map.on('fullscreenchange', function () {
      // if (map.isFullscreen()) {
      //   console.log("entered fullscreen");
      // } else {
      //   console.log("exited fullscreen");
      // }
      console.log('hello');
    });

    function hideControls() {
      const options = {
        cutPolygon: false,
        download: false,
        dragMode: false,
        drawPolygon: false,
        drawPolyline: false,
        drawRectangle: false,
        drawText: false,
        editMode: false,
        removalMode: false,
        rotateMode: false,
      };
      map.pm.addControls(options);
      map.zoomControl.remove();
      fullscreen = false;
    }

    function showControls() {
      map.zoomControl.addTo(map);
      const options = {
        cutPolygon: true,
        download: true,
        dragMode: true,
        drawPolygon: true,
        drawPolyline: true,
        drawRectangle: true,
        drawText: true,
        editMode: true,
        removalMode: true,
        rotateMode: true,
      };
      map.pm.addControls(options);
      fullscreen = true;
    }

    map.on('enterFullscreen', function () {
      showControls();
      setupCustomControls();
    });

    map.on('exitFullscreen', function () {
      hideControls();
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
      width: '280px',
      position: 'right-bottom',
      distance: '10px',
    });

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

    map.on('pm:create', (event) => {
      console.log(event);
      let layer = event.layer;
      drawnItems.addLayer(layer);
      setLayersStyle();
    });

    var baseLayerStyle = 'leaflet-interactive fill-current stroke-0 ';
    var mouseoverStyle = baseLayerStyle + ' opacity-100 text-zinc-500';
    var mouseoutStyle = baseLayerStyle + ' opacity-100 text-zinc-700';

    function setLayersStyle() {
      let stepNumber = 0;
      drawnItems.eachLayer(function (layer, index) {
        if (layer instanceof L.Polygon) {
          layer._path.setAttribute('class', mouseoutStyle);
          layer._path.setAttribute('fill-opacity', 1);
          layer.on('mouseover', function (e) {
            layer._path.setAttribute('class', mouseoverStyle);
          });
          layer.on('mouseout', function (e) {
            layer._path.setAttribute('class', mouseoutStyle);
          });
          // layer.

          function hello() {
            console.log('Hello!');
          }
          layer.feature['table_id'] = stepNumber;
          layer.on('click', (event) => {
            hello();
            current_table_id = layer.feature['table_id'];
            // layer.
          });
        }
        stepNumber += 1;
      });
    }

    function getLayer(layer_id: number) {
      let layers = drawnItems.getLayers();
      let returnLayer;
      layers.forEach((layer: L.Polygon) => {
        if (layer.feature['table_id'] === layer_id) {
          returnLayer = layer;
        }
      });
      return returnLayer;
    }

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
        Notiflix.Notify.failure('You must have some data to save it');
        return;
      } else {
        Notiflix.Notify.success('The data has been saved to localstorage');
      }

      gj.features = removeDuplicates(gjFeatures);
      console.log(drawnItems);
      localStorage.setItem('geojson', JSON.stringify(gj));
    }

    function onlyInA(a: any[], b: any[]) {
      // A comparer used to determine if two entries are equal.
      const isSameUser = (a, b) => equal(a, b);

      // Get items that only occur in the left array,
      // using the compareFunction to determine equality.
      const onlyInLeft = (left, right, compareFunction) =>
        left.filter(
          (leftValue) => !right.some((rightValue) => compareFunction(leftValue, rightValue)),
        );

      const onlyInA = onlyInLeft(a, b, isSameUser);

      return onlyInA;
    }

    function loadGeojsonLS() {
      const geojsonFromLocalStorage = JSON.parse(localStorage.getItem('geojson')).features;
      const drawnGeojson = (drawnItems.toGeoJSON() as any).features || {};

      const newGeojson = onlyInA(geojsonFromLocalStorage, drawnGeojson);

      if (newGeojson) {
        setGeojsonToMap(newGeojson);
      }
      setLayersStyle();
    }

    function setGeojsonToMap(geojson) {
      const feature = L.geoJSON(geojson, {
        style: function (feature) {
          return {
            color: COLORS.EMPTY,
            // weight: 4,
            opacity: 1,
            // fillColor: "fillCurrent",
            fillOpacity: 1,
          };
        },
        pointToLayer: (feature, latlng) => {
          return new L.Marker(latlng);
        },
        onEachFeature: function (feature, layer) {
          // console.log((feature.geometry as any).coordinates.toString());
          // console.log(layer)

          drawnItems.addLayer(layer);
          const coordinates = (feature.geometry as any).coordinates.toString();
          const result = coordinates.match(/[^,]+,[^,]+/g);

          // layer.bindPopup(
          //   "<span>Coordinates:<br>" + result.join("<br>") + "</span>"
          // );
          // feature.properties = { classroom: "305" };
          // console.log(feature.properties);
        },
      }).addTo(map);
      // feature._path.setAttribute('class', 'leaflet-interactive fill-current opacity-50 text-red-500')

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

    // drawnItems.eachLayer((layer) => {
    //   layer.on("click", function () {
    //     console.log(layer);
    //     // layer.remove();
    //     // drawnItems.removeLayer(layer);
    //     // layer.removeFrom(map)
    //   });
    // });

    function setupCustomControls() {
      document.querySelector('#aDelete').addEventListener('click', function (event) {
        event.preventDefault();
        customGlobalRemovalMode = !customGlobalRemovalMode;
        // console.log(localStorage.getItem("geojson"));

        const geojsonFromLocalStorage = JSON.parse(localStorage.getItem('geojson')).features;
        // const drawnGeojson = (drawnItems.toGeoJSON() as any).features || {};
        console.log(geojsonFromLocalStorage);
        // localStorage.removeItem("geojson");

        // Notiflix.Notify.info("All layers have been deleted");

        // drawnItems.eachLayer(function (layer) {
        //   drawnItems.removeLayer(layer);
        // });

        drawnItems.eachLayer((layer) => {
          layer.on('click', function () {
            console.log(layer);
            // layer.remove();
            drawnItems.removeLayer(layer);
            // layer.removeFrom(map)
          });
        });

        // map.pm.toggleGlobalRemovalMode();
        // console.log("niggas");
      });

      document.querySelector('#aSaveLS').addEventListener('click', function (event) {
        event.preventDefault();
        saveGeojsonLS();
      });

      document.querySelector('#aLoadLS').addEventListener('click', function (event) {
        event.preventDefault();
        loadGeojsonLS();
        console.log('aLoadLS');
      });
    }
    setupCustomControls();

    loadGeojsonLS();
    // hideControls();
  });
</script>

<svelte:head>
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.css"
    rel="stylesheet"
  />
</svelte:head>

<div id="map" class="w-full h-screen !bg-gpt-bg">
  {#if fullscreen}
    <div class="absolute z-[1000] right-0">
      <div class="float-right  mr-[10px] mt-[10px]">
        <div class="border-[1.6px] rounded-[4px]">
          <a href="" id="aDelete">
            <div class="p-[5px] border-b-[1px]">
              <Icon name="Remove" class="w-[20px] h-[20px] text-orange-600" fill="currentColor" />
            </div>
          </a>
          <a href="" id="aSaveLS">
            <div class="p-[5px] border-b-[1px]">
              <Icon name="saveLs" class="w-[20px] h-[20px] text-orange-600" fill="currentColor" />
            </div>
          </a>
          <a href="" id="aLoadLS">
            <div class="p-[5px] border-b-[1px]">
              <Icon name="loadLs" class="w-[20px] h-[20px] text-orange-600" fill="currentColor" />
            </div>
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>

<div class="w-1/3 bg-gpt-secondary-bg text-white">
  <div class="m-auto w-fit flex-col space-y-4">
    table id: {current_table_id}
    <br />
    {#if current_table_id in tables}
      <div>Инфрмация</div>
      <div class="!shadow-lg rounded-sm p-4 bg-gpt-secondary-bg  !shadow-orange-500/70">
        <div>Необходимое оборудование</div>
        <textarea
          class="w-full bg-gpt-bg-dark  h-40 appearance-none rounded-sm mb-1 border-none focus:ring-0"
          bind:value={tables[current_table_id].necessary_equipment}
        />
      </div>

      <div class="!shadow-orange-500/70 rounded-sm p-4 bg-gpt-secondary-bg !shadow-lg ">
        <div class="flex space-x-2">
          <div>
            <input
              style="box-shadow: none"
              class="relative  appearance-none rounded-sm mb-1 border-none focus:ring-0 text-orange-500"
              type="checkbox"
              bind:checked={tables[current_table_id].permanent_visit}
              id="checkboxDefault"
            />
          </div>

          <label class="inline-block pl-[0.15rem] hover:cursor-pointer" for="checkboxDefault">
            Default checkbox
          </label>
        </div>

        <div>ИЛИ</div>

        <!-- <div class="flex flex-col">
					<div>с</div>
					<Datepicker datepickerButtons bind:value={tables[current_table_id].dateFrom}  inputClass="bg-zinc-900" />
					<div>по</div>
				</div>  -->
      </div>
    {/if}
  </div>

  <!-- <button on:click={updateBoundVal}>Update Bound Value</button> -->
</div>
<!-- <div>{customGlobalRemovalMode}</div> -->
