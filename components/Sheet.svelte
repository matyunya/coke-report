<script>
  import VirtualList from "/components/VirtualList.svelte";
  import HeadersRow from "./HeadersRow.svelte";
  import Row from "./Row.svelte";
  import Meta from "./Meta.svelte";
  import { sort, setSort, transformed, summary, viewport, source, saveSource } from "/store.js";

  export let rowHeight = 20;
  export let columnWidth = 80;
  export let classes = "m-4";
  export let maxItems = 30;

  $: count = $transformed.count();
  $: columnNames = $transformed.getColumnNames();
  $: height = (Math.min(count, maxItems) * rowHeight || 600) + "px";

  let start = 0,
    end = 0;

  let cache = new Map();
  let updated = new Date();
  let visible = true;
  let edited;

  $: if ($transformed) {
    rebuildCache();
    updated = new Date();
  }

  const getValue = (i) => Object.values($transformed.at(i) || {});

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
  <Meta bind:visible />
  {#if visible}
    {#if $viewport === "table"}
      <HeadersRow
        sort={$sort}
        item={columnNames}
        {columnWidth}
        {rowHeight}
        on:sort
        on:sort={(e) => setSort(e.detail)}
      />
      {#if $transformed && count > 0}
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
    {:else if $viewport === "editor"}
      <textarea on:change={(v) => (edited = v.target.value)} class="w-full h-full editor">
        {$source}
      </textarea>
      <button on:click={() => saveSource(edited)} class="button">Save</button>
    {/if}
  {:else}
    <div class="p-8">
      {$summary}
    </div>
  {/if}
</div>

<style>
  .gridlayout__container {
    position: relative;
    color: black;
    font-size: 12px;
  }

  .editor {
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
    font-weight: 400;
    height: 340px;
    letter-spacing: normal;
    line-height: 20px;
    padding: 10px;
    tab-size: 4;
  }
</style>
