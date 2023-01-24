<script>
  // import * as PANOLENS from "panolens/build/panolens.min.js";
  import * as PANOLENS from "panolens";
  import { onMount } from "svelte";

  const sunset = new URL("$lib/panorams/sunset.jpg", import.meta.url).href;
  const tunnel = new URL("$lib/panorams/tunnel.jpg", import.meta.url).href;
  const move = new URL("$lib/panorams/move.png", import.meta.url).href;
  let container;
  onMount(() => {
    const panorama = new PANOLENS.ImagePanorama(tunnel);
    const panorama2 = new PANOLENS.ImagePanorama(sunset);

    const infospot = new PANOLENS.Infospot(500, PANOLENS.DataImage.Arrow);
    infospot.position.set(-100, -500, -5000);
    infospot.addHoverText("The Story");
    infospot.lockHoverElement();
    infospot.addEventListener("click", function () {
      viewer.setPanorama(panorama2);
      panorama2.toggleInfospotVisibility(true);
    });

    const infospot2 = new PANOLENS.Infospot(500, PANOLENS.DataImage.Arrow);
    infospot2.position.set(-100, -500, -5000);
    infospot2.addHoverText("The Story");
    infospot2.addEventListener("click", function () {
      viewer.setPanorama(panorama);
      panorama.toggleInfospotVisibility(true);
    });

    panorama.add(infospot);
    panorama2.add(infospot2);

    const viewer = new PANOLENS.Viewer({
      container: container,
      autoHideInfospot: false,
    });
    viewer.add(panorama, panorama2);

    panorama.toggleInfospotVisibility(true);

    panorama.addEventListener("click", function (e) {
      if (e.intersects.length > 0) return;
      const a = viewer.raycaster.intersectObject(viewer.panorama, true)[0]
        .point;
      console.log("click panorama:", e);
      console.log("point:", a);
    });
  });
</script>

<div bind:this={container} class="w-screen h-screen" />
