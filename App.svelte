<script>
  import Upload from "/components/Upload.svelte";
  import Sheet from "/components/Sheet.svelte";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import headlong from "~matyunya/headlong";
  import { readCSV, sort, transformed } from "./store.js";
  import download from "./toXLS.js";
  import { classes } from "./headlong-classes.js";

  let disabled = false;

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
      "max-w-2xl px-2 mx-4 text-xs bg-white tracking-wide font-mono dark:from-gray-900 dark:via-gray-800 to-warm-gray-100 dark:to-warm-gray-800 hover:ring-1 ring-0  transition duration-150 shadow-sm rounded-sm"
    );

    apply(
      ".header",
      "capitalize font-bold cursor-pointer select-none bg-opacity-5 border-b border-gray-200"
    );

    apply(".gridlayout__container", "shadow rounded bg-white");

    return unsubscribe;
  });
</script>

<div class="fixed w-full h-10 p-1 top-0 z-20 blurred-bg flex">
  <Upload on:attached={(e) => readCSV(e.detail)} />

  <button
    on:click={async () => {
      disabled = true;
      try {
        await download();
      } finally {
        disabled = false;
      }
    }}
    class:opacity-50={disabled}
    class:hover:ring-1={!disabled}
    class:bg-gray-200={disabled}
    class:pointer-events-none={disabled}
    class="button ring-green-500"
    {disabled}
  >
    {disabled ? "Generating file..." : "Export to Excel"}
  </button>
</div>

<Sheet bind:sort={$sort} classes="mt-12" df={$transformed} columnWidth={150} />

<style>
  .blurred-bg {
    backdrop-filter: blur(2px);
  }
</style>
