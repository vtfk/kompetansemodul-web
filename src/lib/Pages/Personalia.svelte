<script>
	import { getMe }  from '../services/useApi'
</script>

<div class="content">
	{#await getMe()}
	<p>...Lastær</p>
	{:then res}
		<h1>Ditt navn: {res.fornavn}, om du lurte.</h1>
		<p>Dette er informasjon om deg</p>
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
