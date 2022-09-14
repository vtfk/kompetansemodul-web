<script>
  	import { onMount } from "svelte/internal";
	import getMe  from '../services/useApi'

	let name = 'Personalia';

	onMount(async () => {
		getMe()
	})
</script>

<div>
	<h1>Ditt navn: {name}, om du lurte.</h1>
	<p>Dette er informasjon om deg</p>
</div>

<style>
	h1 {
		color: var(--deepSeaGreen);
	}

</style>