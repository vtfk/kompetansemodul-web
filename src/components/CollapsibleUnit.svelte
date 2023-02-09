<script context=module>
	import { setContext, getContext } from 'svelte';
	import { writable } from 'svelte/store';
	
	const key = Symbol()

	export const getCollapsibleContext = () => getContext(key);
	export const createCollapsibleContext = () => {
		const current = writable(null);
		const context = { current };
		setContext(key, context);

		return context;
	}
</script>
<script>
	import { quadInOut } from 'svelte/easing'
	import { slide } from 'svelte/transition'

	export let open = false

	const { current } = getCollapsibleContext()
	const currentKey = {}

	createCollapsibleContext()

	const handleClick = () => {
		open = !open
		if (open) {
			$current = currentKey
		}
	}
	// Allows only one main section to open at the same time, uncomment for it to work.
	$: if ($current != currentKey) {
		// open = false
	}
</script>
<div>
    <div>
		<div on:click={handleClick}>
			<div class="text">
				<slot name="head"></slot> 
			</div>
		</div>
		{#if open}
		<div transition:slide="{{ duration: 150, easing: quadInOut }}" >
			<slot name="details">
			</slot>
		</div>
		{/if}
	</div>
</div> 

<style>
	
</style>