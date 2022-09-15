<script>
  	import { onMount } from "svelte/internal";
	import getMe  from '../services/useApi'

	/*onMount(async () => {
		try {
			const test = await getMe()
			name = test.fornavn
		} catch (error) {
			console.log(error)
		}
	})*/
</script>

<div class="content">
	{#await getMe()}
	<p>...Lastær</p>
	{:then res}
		<h1>Ditt navn: {res.fornavn}, om du lurte.</h1>
		<p>Dette er informasjon om deg</p>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	h1 {
		color: var(--deepSeaGreen);
	}

	.content {
		padding-top: 1rem
	}

</style>
