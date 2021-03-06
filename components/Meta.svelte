<script>
  import Upload from "/components/Upload.svelte";
  import download, { fetchTemplate } from "/toXLS.js";
  import { readCSV } from "/store.js";

  export let title;
  export let visible;

  let disabled = false;
  let readingCSV = false;
</script>

<div
  class="w-full py-1 h-6 flex flex-row justify-even border-b border-gray-100 dark:border-gray-800 text-blue-gray-600 dark:text-blue-gray-300"
>
  {#if title}
    <button
      class="button hover:text-black dark:hover:text-white"
      on:click={() => (visible = !visible)}
    >
      {visible ? "▼" : "▲"}
    </button>
    <div class="mr-8 button max-w-xl truncate font-bold pl-2" {title}>{title}</div>
  {/if}
  <Upload
    disabled={readingCSV}
    class="hover:text-black dark:hover:text-white"
    on:attached={async (e) => {
      try {
        readingCSV = true;
        await readCSV(e.detail);
      } finally {
        readingCSV = false;
      }
    }}
  >
    {readingCSV ? "Loading CSV..." : "Upload CSV"}
  </Upload>

  <!-- <Upload class="hover:text-emerald-600" on:attached={(e) => fetchTemplate(e.detail)}>
    Upload Excel template
  </Upload> -->

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
    class:bg-gray-200={disabled}
    class:pointer-events-none={disabled}
    class="button hover:underline hover:text-emerald-600"
    {disabled}
  >
    {disabled ? "Generating file..." : "Export to Excel"}
  </button>
</div>

<style>
  :global(.button) {
    font-size: 12px;
  }
</style>
