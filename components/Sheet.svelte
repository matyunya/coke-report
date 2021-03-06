<script>
  import VirtualList from "/components/VirtualList.svelte";
  import HeadersRow from "./HeadersRow.svelte";
  import Row from "./Row.svelte";
  import Meta from "./Meta.svelte";

  export let df;
  export let rowHeight = 20;
  export let columnWidth = 80;
  export let classes = "";
  export let sort = {};
  export let maxItems = 30;
  export let title;

  $: count = df.count();
  $: columnNames = df.getColumnNames();
  $: height = (Math.min(count, maxItems) * rowHeight || 600) + "px";

  let start = 0,
    end = 0;

  let cache = new Map();
  let updated = new Date();
  let visible = true;

  $: if (df) {
    console.log("rebuilding cache");
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
  class="{classes} dark:text-gray-100 text-black gridlayout__container dark:bg-gray-700"
  style="width: {columnNames.length * columnWidth || 600}px;"
>
  <Meta bind:visible {title} />
  {#if visible}
    <HeadersRow {sort} item={columnNames} {columnWidth} {rowHeight} on:sort />
    {#if df && count > 0}
      <VirtualList
        {height}
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
    {:else}
      <div class="flex items-center justify-center h-full w-full" style="height: {height}">
        Empty spreadsheet
      </div>
    {/if}
  {:else}
    Show n rows, some summary?
  {/if}
</div>

<style>
  .gridlayout__container {
    position: relative;
    color: black;
    font-size: 12px;
  }
</style>
