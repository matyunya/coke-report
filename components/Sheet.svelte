<script>
  import VirtualList from "/components/VirtualList.svelte";
  import HeadersRow from "./HeadersRow.svelte";
  import Row from "./Row.svelte";
  import { DataFrame } from "data-forge@1.8.17/dist/esm/index.esm.js";

  export let df = new DataFrame([]);
  export let rowHeight = 20;
  export let columnWidth = 80;
  export let classes = "md:m-12 md:mr-24 m-6 mt-12";
  export let sort = {};
  export let maxItems = 30;

  $: count = df.count();

  // Could use conclude to avoid calculating skipped rows?
  let start = 0,
    end = 0;

  let cache = new Map();
  let updated = new Date();

  $: if (df) {
    console.log('rebuilding cache');
    rebuildCache();
    updated = new Date();
  }

  const getValue = (i) => Object.values(df.at(i) || {});

  function rebuildCache() {
    cache =
      count >= maxItems + 20
        ? new Map([...Array(maxItems + 20).keys()].map((k) => [k + start, getValue(k + start)]))
        : new Map();
  }

  function getItem(i) {
    if (count === 0) return {};
    if (cache.has(i)) return cache.get(i);

    const val = getValue(i);
    cache.set(i, val);

    return val;
  }
</script>

<div
  class="{classes} dark:text-white text-black gridlayout__container mx-auto dark:bg-gray-800"
  style="width: {df.getColumnNames().length * columnWidth}px;"
>
  <HeadersRow {sort} item={df.getColumnNames()} {columnWidth} {rowHeight} on:sort />
  {#if df && count > 0}
    <VirtualList
      height="{Math.min(count, maxItems) * rowHeight}px"
      {maxItems}
      {updated}
      itemCount={count}
      itemHeight={rowHeight}
      bind:start
      bind:end
      let:index
    >
      <Row item={getItem(index)} {columnWidth} {rowHeight} />
    </VirtualList>
  {/if}
</div>

<style>
  .gridlayout__container {
    position: relative;
    color: black;
    font-size: 12px;
  }
</style>
