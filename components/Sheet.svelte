<script>
  import VirtualList from "/components/VirtualList.svelte";
  import HeadersRow from "./HeadersRow.svelte";
  import Row from "./Row.svelte";
  import { DataFrame } from 'data-forge@1.8.17/dist/esm/index.esm.js';

  export let df = new DataFrame([]);
  export let rowHeight = 20;
  export let columnWidth = 80;
  export let classes = "md:m-12 md:mr-24 m-6 mt-12";
  export let sort = {};
  export let maxItems = 30;
</script>

<div
  class="{classes} dark:text-white text-black gridlayout__container mx-auto dark:bg-gray-800"
  style={`width: ${df.getColumnNames().length * columnWidth}px;`}
>
  <HeadersRow bind:sort item={df.getColumnNames()} {columnWidth} {rowHeight} />
  <VirtualList
    height="{Math.min(df.toArray().length, maxItems) * rowHeight}px"
    items={df.toArray()}
    itemHeight={rowHeight}
    let:item
  >
    <Row {item} {columnWidth} {rowHeight} />
  </VirtualList>
</div>

<style>
  .gridlayout__container {
    position: relative;
    color: black;
    font-size: 12px;
  }
</style>
