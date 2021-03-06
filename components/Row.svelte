<script>
  export let item;
  export let columnWidth;
  export let rowHeight;
</script>

<div class="flex flex-row {$$props.wrapperClass || ""}">
  {#each item as cell, i}
    <div
      class="w-block px-1 overflow-hidden truncate {$$props.class || ""}"
      style="width: {columnWidth}px; height: {rowHeight}px;"
      title={cell}
    >
      <slot {cell} last={i === item.length} first={i === 0}>{cell}</slot>
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
