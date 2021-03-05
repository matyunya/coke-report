<script>
  import { createEventDispatcher } from "svelte";
  import Row from "./Row.svelte";

  const dispatch = createEventDispatcher();

  export let sort;
  export let item;
  export let rowHeight;
  export let columnWidth;

  function updateSort(column) {
    let s = { ...sort };
    if (s[column] === false) {
      s[column] = undefined;
    } else {
      s[column] = !Boolean(s[column]);
    }
    dispatch("sort", s);
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
