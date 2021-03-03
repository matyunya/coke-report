<script>
  import Row from "./Row.svelte";

  export let sort;
  export let item;
  export let rowHeight;
  export let columnWidth;

  function updateSort(column) {
    if (sort[column] === false) {
      sort[column] = undefined;
    } else {
      sort[column] = !Boolean(sort[column]);
    }
  }
</script>

<Row class="header" {item} {rowHeight} {columnWidth} let:cell>
  <div class="w-full h-full" on:click={() => updateSort(cell)}>
    {#if sort[cell] !== undefined}
      {sort[cell] ? "↑" : "↓"}
    {/if}
    {cell}
  </div>
</Row>

<style>
  :global(.header) {
    backdrop-filter: blur(3px);
  }
</style>
