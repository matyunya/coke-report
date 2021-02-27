<script>
  import { createEventDispatcher } from "svelte";
  export let disabled = false;

  const dispatch = createEventDispatcher();
  let node;

  function read(e) {
    var file = e.target.files.item(0);
    var reader = new FileReader();

    reader.onload = function() {
      dispatch("upload", reader.result);
    }

    reader.readAsText(file);
  }
</script>

<style>
  :global(.mode-dark) input {
    color: white;
  }
</style>

<input
  bind:this={node}
  type="file"
  class="hidden"
  on:change={read}
  {disabled}
/>
<button
  class:opacity-50={disabled}
  class:hover:ring-1={!disabled}
  class:bg-gray-200={disabled}
  class:pointer-events-none={disabled}
  on:click={() => node.click()}
  class="button {$$props.class || ""}">
  <slot>Upload CSV</slot>
</button>
