<script>
  import Upload from "/components/Upload.svelte";
  import Sheet from "/components/Sheet.svelte";
  import Select from "~matyunya/cap-table/components/Select.svelte";
  import { prefectures } from "./prefectures.js";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import headlong from "~matyunya/headlong";
  import {
    prefecture,
    store,
    csv,
    UPDATE_PREFECTURE,
    UPDATE_CSV,
    TOGGLE_USE_GENERATED_DATA,
    blocks,
    aggregatedBlocks,
    isEmptyAggregated,
    useGeneratedData,
  } from "./store.js";
  import { download } from "./toXLS.js";
  import { classes } from "./headlong-classes.js";

  onMount(() => {
    const body = document.querySelector("body");

    body.classList.add("opacity-0");

    const { unsubscribe, apply } = headlong({ classes });
    "bg-gradient-to-r to-blue-50 dark:from-gray-900 via-gray-50 dark:via-gray-800 from-warm-gray-50 dark:to-warm-gray-800 transition duration-500"
      .split(" ")
      .map((c) => body.classList.add(c));

    body.classList.remove("opacity-0");

    apply(
      ".button",
      "w-full p-2 bg-white tracking-wide font-mono dark:from-gray-900 dark:via-gray-800 to-warm-gray-100 dark:to-warm-gray-800 hover:ring-1 ring-0 ring-blue-500 transition duration-150 shadow-sm rounded-sm"
    );

    return unsubscribe;
  });
</script>

<Upload disabled={$useGeneratedData} on:upload={(e) => store.commit(UPDATE_CSV, e.detail)} />

<div class="mt-4">
  <div
    class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
  >
    <input
      on:change={() => store.commit(TOGGLE_USE_GENERATED_DATA)}
      type="checkbox"
      name="toggle"
      id="toggle"
      class="toggle-checkbox absolute block w-6 h-6 rounded-xl bg-white border-4 appearance-none cursor-pointer transition duration-200 ring-0 hover:ring-1 ring-blue-300"
    />
    <label
      for="toggle"
      class="toggle-label block overflow-hidden h-6 rounded-xl bg-gray-300 cursor-pointer"
    />
  </div>
  <label for="toggle" class="text-sm text-gray-700 dark:sm:text-red-500 dark:text-green-500"
    >Use generated data</label
  >
</div>

{#if $csv || $useGeneratedData}
  <div transition:fly={{ duration: 100 }} class="mt-8">
    <h3 class="font-bold text-lg mb-2">Filter by prefecture</h3>
    <Select
      on:change={(v) => store.commit(UPDATE_PREFECTURE, v.target.value)}
      value={$prefecture}
      options={Object.values(prefectures)
        .flat()
        .map((p) => [p, p])}
    />
    <Sheet classes="mt-8" {...$blocks} columnWidth={120} />
  </div>
  <div transition:fly={{ duration: 100 }} class="mt-8">
    <h3 class="font-bold text-lg mb-2">Aggregated by year</h3>
    <Sheet classes="mt-8" {...$aggregatedBlocks} columnWidth={100} />
  </div>

  <button
    on:click={download}
    class:opacity-50={$isEmptyAggregated}
    class:hover:ring-1={!$isEmptyAggregated}
    class:bg-gray-200={$isEmptyAggregated}
    class:pointer-events-none={$isEmptyAggregated}
    class="button mt-8"
    disabled={$isEmptyAggregated}
  >
    Export to Excel
  </button>
{/if}

<style>
  .toggle-checkbox:checked {
    right: 0;
    border-color: rgba(96, 165, 250, 1);
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: rgba(191, 219, 254, 0.5);
  }
</style>
