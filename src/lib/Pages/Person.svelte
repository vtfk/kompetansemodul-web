<script>
	import { getPerson }  from '../services/useApi'
	import { searchUpn }  from '../services/store'
	import { get } from 'svelte/store'

	let personUpn
	searchUpn.subscribe(value => {
		personUpn = value
	})

</script>

<div class="content">
	{#await getPerson(personUpn)}
	<p>...Lastær</p>
	{:then res}
		<h1>Brukenrssss navn: {res.fornavn}, om du lurte lort.</h1>
		<p>Dette er informasjon om hen</p>
		<pre>{JSON.stringify(res, null, 2)}</pre>
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
