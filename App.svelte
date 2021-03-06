<script>
  import Sheet from "/components/Sheet.svelte";
  import { onMount } from "svelte";
  import headlong from "~matyunya/headlong";
  import { sort, setSort, transformed, title } from "/store.js";
  import { classes } from "/headlong-classes.js";

  export let columnWidth = 150;

  onMount(() => {
    try {
      const { unsubscribe, apply } = headlong({ classes });
      apply(
        ".button",
        "max-w-2xl px-1 mx-1 tracking-tight font-mono transition duration-500"
      );

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
  sort={$sort}
  df={$transformed}
  title={$title}
  on:sort={(e) => setSort(e.detail)}
  {columnWidth}
/>

<!-- Uncomment to inspect detected types -->

<!-- <Sheet bind:sort={$sort} classes="mt-12" df={$transformed.detectTypes()} columnWidth={150} /> -->
