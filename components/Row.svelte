<script>
  import { fade } from "svelte/transition";

  export let item;
  export let columnWidth;
  export let rowHeight;
</script>

<div in:fade={{ duration: 150 }} class="flex flex-row">
  {#each item as cell}
    <div
      class="w-block px-1 overflow-hidden dark:bg-dark-700 dark:text-white truncate {$$props.class || ""}"
      style="width: {columnWidth}px; height: {rowHeight}px;"
      title={cell}
    >
      <slot {cell}>{cell}</slot>
    </div>
  {/each}
</div>

<style>
  .w-block {
    line-height: 16px;
    padding-top: 2px;
    padding-bottom: 2px;
  }
</style>
