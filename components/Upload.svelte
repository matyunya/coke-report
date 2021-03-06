<script>
  import { createEventDispatcher } from "svelte";
  export let disabled = false;

  const dispatch = createEventDispatcher();
  let node;

  function read(e) {
    var file = e.target.files.item(0);
    dispatch("attached", file);
  }
</script>

<input
  bind:this={node}
  type="file"
  class="hidden"
  on:change={read}
  {disabled}
/>
<button
  {disabled}
  on:click={() => node.click()}
  class="button hover:underline {$$props.class || ""}">
  <slot>Upload CSV</slot>
</button>
