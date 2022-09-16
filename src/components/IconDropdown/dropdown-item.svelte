<svelte:options tag="my-dropdown-item" />

<script>
  import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
  export let value;

  function selectValue() {
		dispatch("clicked", value);
        // console.log(value)
        // const { select } =  getContext('dropdown');
        // select(value)
  }

</script>

<div class="option" on:click={selectValue}>
  <slot></slot>
</div>

<style>
  .option {
    background-color: #fff;
    border: solid #C6C6C6;
    border-width: 0.01rem;
    min-width: 5rem;
    padding: 0.25rem 0rem 0.25rem 0rem;
    overflow: auto;
    z-index: 100;
    box-shadow: 0 1rem 0.5rem 0 rgba(0, 0, 0, 0.025);
  }

  .option:hover {
    background: #D2EFF6;
  }
</style>