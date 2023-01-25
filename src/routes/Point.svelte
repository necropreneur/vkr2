<script>
  import { onMount } from "svelte";

  export let name;

  export let x = "10px";
  export let y = "10px";

  export let width = "";
  export let height = "1.5rem";
  export let focusable = false;

  let Svg = "";

  onMount(async () => {
    // This error is weird. It gives 2 errors that there is no Svg.match method
    Svg = (await import(`./icons/${name}.svg`)).default;
    // if (Svg) {
    //   let viewBox = Svg.match(/viewBox="(.+?)"/)[1];
    //   let [viewBoxWidth, viewBoxHeight] = viewBox.split(" ").slice(2);
    //   width = `${(height * viewBoxWidth) / viewBoxHeight}px`;
    // }
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
