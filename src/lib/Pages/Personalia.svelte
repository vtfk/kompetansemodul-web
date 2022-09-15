<script>
  	import { onMount } from "svelte/internal";
	import getMe  from '../services/useApi'

	let name = 'Personalia';

	onMount(async () => {
		try {
			const test = await getMe()
			name = test.fornavn
		} catch (error) {
			console.log(error)
		}
	})
</script>

<div class="content">
	<h1>Ditt navn: {name}, om du lurte.</h1>
	<p>Dette er informasjon om deg</p>
</div>

<style>
	h1 {
		color: var(--deepSeaGreen);
	}

	.content {
		padding-top: 1rem
	}

</style>
