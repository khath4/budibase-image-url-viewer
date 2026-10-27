<script>
  import { getContext } from "svelte"
  import Icon from "./Icon.svelte"

  export let urls = ""
  export let layout = "gallery"
  export let objectFit = "contain"
  export let height = 200
  export let openOnClick = true

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  let selectedIndex = 0

  // Parse the comma-separated string of URLs into a clean list.
  $: list = (urls || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)

  $: if (selectedIndex > list.length - 1) {
    selectedIndex = Math.max(0, list.length - 1)
  }

  $: selectedUrl = list[selectedIndex]
  $: count = list.length
  $: inBuilder = $builderStore?.inBuilder

  const fileName = url => {
    try {
      const clean = url.split("?")[0].split("#")[0]
      return decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1)) || url
    } catch (e) {
      return url
    }
  }

  const navLeft = () => {
    if (selectedIndex > 0) selectedIndex -= 1
  }
  const navRight = () => {
    if (selectedIndex < count - 1) selectedIndex += 1
  }
</script>

<div use:styleable={$component.styles} class="image-url-viewer">
  {#if count === 0}
    {#if inBuilder}
      <div class="placeholder">No image URLs provided</div>
    {/if}
  {:else if layout === "grid"}
    <div class="grid">
      {#each list as url, i}
        <div class="thumb" style={`height:${height}px`}>
          {#if openOnClick}
            <a href={url} target="_blank" rel="noopener noreferrer" title={fileName(url)}>
              <img src={url} alt={fileName(url)} style={`object-fit:${objectFit}`} class="clickable" />
            </a>
          {:else}
            <img src={url} alt={fileName(url)} style={`object-fit:${objectFit}`} />
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="gallery">
      <div class="title">
        {#if openOnClick}
          <a
            class="filename"
            href={selectedUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={fileName(selectedUrl)}
          >
            {fileName(selectedUrl)}
          </a>
        {:else}
          <div class="filename" title={fileName(selectedUrl)}>
            {fileName(selectedUrl)}
          </div>
        {/if}
      </div>

      <div class="image-wrapper" style={`height:${height}px`}>
        {#if openOnClick}
          <a href={selectedUrl} target="_blank" rel="noopener noreferrer" class="image-link">
            <img
              src={selectedUrl}
              alt={fileName(selectedUrl)}
              style={`object-fit:${objectFit}`}
              class="clickable"
            />
          </a>
        {:else}
          <img
            src={selectedUrl}
            alt={fileName(selectedUrl)}
            style={`object-fit:${objectFit}`}
          />
        {/if}

        {#if selectedIndex > 0}
          <div class="nav left" on:click={navLeft}>
            <Icon name="ChevronLeft" />
          </div>
        {/if}
        {#if selectedIndex < count - 1}
          <div class="nav right" on:click={navRight}>
            <Icon name="ChevronRight" />
          </div>
        {/if}
      </div>

      {#if count > 1}
        <div class="footer">Image {selectedIndex + 1} of {count}</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .image-url-viewer {
    width: 100%;
  }
  .placeholder {
    color: var(--spectrum-global-color-gray-600, #888);
    font-size: 14px;
    padding: 12px;
    border: 1px dashed var(--spectrum-global-color-gray-400, #ccc);
    border-radius: 4px;
    text-align: center;
  }

  .gallery {
    display: flex;
    flex-direction: column;
    background-color: var(--spectrum-global-color-gray-50, #fff);
    border: 1px solid var(--spectrum-alias-border-color, #d3d3d3);
    border-radius: 4px;
    padding: 10px;
    position: relative;
  }
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
  .filename {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
  }
  a.filename {
    color: var(--spectrum-global-color-blue-600, #1473e6);
    text-decoration: none;
  }
  a.filename:hover {
    text-decoration: underline;
  }
  .image-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .image-link {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    height: 100%;
  }
  .image-wrapper img {
    max-width: 100%;
    height: 100%;
  }
  img.clickable {
    cursor: pointer;
  }
  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
  }
  .nav:hover {
    background: rgba(0, 0, 0, 0.65);
  }
  .nav.left {
    left: 6px;
  }
  .nav.right {
    right: 6px;
  }
  .footer {
    margin-top: 6px;
    text-align: center;
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600, #888);
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .thumb {
    flex: 0 0 auto;
    border: 1px solid var(--spectrum-alias-border-color, #d3d3d3);
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--spectrum-global-color-gray-50, #fff);
  }
  .thumb img {
    height: 100%;
    max-width: 240px;
  }
</style>
