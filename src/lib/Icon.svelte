<script>
  import { onMount } from "svelte";

  export let name;

  export let fill = "none";
  export let stroke = "none";

  export let width = "1.5rem";
  export let height = "1.5rem";
  export let focusable = false;

  let Svg = "";

  onMount(async () => {
    // This error is weird. It gives 2 errors that there is no Svg.match method
    Svg = (await import(`./icons/${name}.svg`)).default;

  });
</script>

<svelte:component
  this={Svg}
  class={$$props.class}
  {fill}
  {stroke}
  {focusable}
  {width}
  {height}
/>
