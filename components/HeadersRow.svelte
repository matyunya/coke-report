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


  function resize(node, direction) {
    function onDrag(e) {
      console.log("mousedown", direction, e.target.dataset.name);
    }

    console.log(node, direction);

    node.addEventListener("mousedown", onDrag);

    return {
      destroy: () => {
        node.removeEventListener("mousedown", onDrag);
      }
    }
  }
</script>

<Row
  wrapperClass="divide-x dark:divide-gray-800"
  class="header"
  {item}
  {rowHeight}
  {columnWidth}
  let:cell
  let:last
  let:first
>
  <div class="w-full h-full" on:click={() => updateSort(cell)}>
    {#if !first}
      <div
        data-name={cell}
        class="absolute top-0 left-0 h-full w-4 hover:border-l border-blue-500 resize"
        use:resize={"left"}
      />
    {/if}
    {#if sort[cell] !== undefined}
      {sort[cell] ? "↑" : "↓"}
    {/if}
    {cell}
    {#if !last}
      <div
        data-name={cell}
        class="absolute top-0 right-0 h-full w-4 hover:border-r border-blue-500 resize"
        use:resize={"right"}
      />
    {/if}
  </div>
</Row>

<style>
  :global(.header) {
    backdrop-filter: blur(3px);
  }
  .resize {
    cursor: col-resize;
  }
</style>
