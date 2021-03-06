<script>
  import Upload from "/components/Upload.svelte";
  import downloadExcel, { fetchTemplate } from "/utils/xls.js";
  import { readCSV, title, setViewport, viewport } from "/store.js";

  export let visible;

  let downloadingXLSX = false;
  let readingCSV = false;
</script>

<div
  class="w-full py-1 h-6 flex flex-row justify-even border-b border-gray-200 dark:border-gray-800 text-blue-gray-600 dark:text-blue-gray-300"
>
  {#if $title}
    <button class="button" on:click={() => (visible = !visible)}>
      {visible ? "▼" : "▲"}
    </button>
    <div class="mr-8 button max-w-xl truncate font-bold pl-2" title={$title}>{$title}</div>
  {/if}

  <Upload
    disabled={readingCSV}
    on:attached={async (e) => {
      try {
        readingCSV = true;
        // TODO: read file type
        await readCSV(e.detail);
      } finally {
        readingCSV = false;
      }
    }}
  >
    {readingCSV ? "Loading CSV..." : "Upload CSV"}
  </Upload>

  {#if $title}
    <button on:click={() => setViewport($viewport === "table" ? "editor" : "table")} class="button">
      Open {$viewport === "table" ? "editor" : "table"}
    </button>
  {/if}

  {#if $title}
    <Upload on:attached={(e) => fetchTemplate(e.detail)}>Upload Excel template</Upload>
    <button
      on:click={async () => {
        downloadingXLSX = true;
        try {
          await downloadExcel();
        } finally {
          downloadingXLSX = false;
        }
      }}
      class="button"
      disabled={downloadingXLSX}
    >
      {downloadingXLSX ? "Generating file..." : "Export to Excel"}
    </button>
  {/if}
</div>

<style>
  :global(.button) {
    font-size: 12px;
  }
</style>
