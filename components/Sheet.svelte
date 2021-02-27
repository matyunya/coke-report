<script>
  import { fade } from "svelte/transition";
  import VirtualList from '/components/VirtualList.svelte';
//   import VirtualList from '@sveltejs/svelte-virtual-list/VirtualList.svelte';
  export let blocks = new Map();
  export let nRows = 10;
  export let nCols = 5;
  export let rowHeight = 20;
  export let columnWidth = 80;
  export let store;
  export let classes = "md:m-12 md:mr-24 m-6 mt-12";

  let editing = false;
  let onSave = false;
  let editingValue;

  $: items = [...blocks].reduce((acc, [id, {
    position: [firstRow, firstCol, lastRow, lastCol],
    ...params
  }]) => {
    if (!acc[firstRow]) acc[firstRow] = [];

    acc[firstRow].push({ id, pos: [firstRow, firstCol, lastRow - firstRow + 1, lastCol - firstCol + 1], ...params });

    return acc;
  }, []);
</script>

<style>
  .gridlayout__container {
    position: relative;
    color: black;
    font-size: 12px;
  }

  .tile {
    line-height: 16px;
    padding-top: 2px;
    padding-bottom: 2px;
  }

  .w-block {
    box-shadow: 0 0 0 0.5px rgb(239,239,239) inset;
  }

  :global(.mode-dark) .w-block {
    box-shadow: 0 0 0 0.5px rgb(50,50,50) inset;
  }

  .w-block:hover .toggle {
    opacity: 1;
  }
  .toggle {
    margin-top: 2px;
  }
</style>

<div class="{classes} dark:text-white text-black gridlayout__container gridlines shadow rounded bg-white dark:bg-gray-800" style={`width: ${(nCols + 1) * columnWidth}px;`}>
  <VirtualList height="{Math.min(items.length, 30) * rowHeight}px" {items} itemHeight={rowHeight} let:item>
    <div in:fade={{ duration: 150 }} class="flex flex-row">
      {#each item as cell}
        <div
          on:click={cell.onClick}
          class="w-block tile px-1 overflow-hidden dark:bg-dark-700 dark:text-white truncate {cell.classes || ""}"
          style="width: {columnWidth}px; height: {rowHeight}px;"
        >
          {cell.value}
        </div>
      {/each}
    </div>
  </VirtualList>
</div>
