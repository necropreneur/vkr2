<script>
  import Menu from "./Menu.svelte";
  import Panolens from "./Panolens.svelte";
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <!-- <div class="absolute inset-0 bg-neutral-700 flex justify-center items-center">
		<PlatformMarker/>
	</div> -->
  <!-- <div class="absolute inset-0 bg-gray-900">
		<Map/>
	</div> -->
  <div class="flex">
    <div class="inset-0">
      <Menu />
    </div>
    <Panolens />
  </div>
</section>
