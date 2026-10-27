<script>
  // Minimal Icon using the host's Spectrum icon sprite
  export let name = "ChevronRight"
  export let size = "M"
</script>

<svg
  on:click
  class="spectrum-Icon spectrum-Icon--size{size}"
  focusable="false"
  aria-hidden="true"
  aria-label={name}
>
  <use style="pointer-events: none;" xlink:href="#spectrum-icon-18-{name}" />
</svg>

<style>
  svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
</style>
