<script>
  import Sheet from "/components/Sheet.svelte";
  import { onMount } from "svelte";
  import headlong from "~matyunya/headlong";
  import { classes } from "/headlong-classes.js";
  import { store } from "/store.js";

  export const value = store;
  export let columnWidth = 150;

  onMount(() => {
    try {
      const { unsubscribe, apply } = headlong({ classes });
      apply(
        ".button",
        "max-w-2xl pl-3 transition font-medium duration-500"
      );

      apply(
        ".button:disabled",
        "opacity-50 text-gray-400 pointer-events-none",
      );

      apply(".button:hover", "text-black underline");
      apply(".mode-dark .button:hover", "text-white");

      apply(
        ".header",
        "capitalize text-blue-gray-800 cursor-pointer select-none bg-opacity-5 border-b border-gray-200 divide-y-1"
      );

      apply(".gridlayout__container", "shadow rounded bg-white");

      return unsubscribe;
    } catch (e) {
      console.error(e); //already running
    }
  });
</script>

<Sheet
  {columnWidth}
  on:sort
/>

<!-- Uncomment to inspect detected types -->

<!-- <Sheet bind:sort={$sort} classes="mt-12" df={$transformed.detectTypes()} columnWidth={150} /> -->
