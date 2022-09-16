<script>
	import { getPerson }  from '../services/useApi'
	import { searchUpn }  from '../services/store'
	import PersonCard from '../components/PersonCard.svelte'

	let personUpn
	searchUpn.subscribe(value => {
		personUpn = value
	})

</script>

<div class="content">
	{#await getPerson(personUpn)}
	<p>...Lastær pærsson</p>
	{:then res}
		<PersonCard personData={{
			name: `${res.fornavn} ${res.etternavn}`,
			email: res.kontaktEpostadresse,
			mainPosition: res.harAktivtArbeidsforhold ? res.aktiveArbeidsforhold.find(forhold => forhold.lonnsprosent > 0 && forhold.hovedstilling).stillingstittel : 'Dagdranker',
			officeLocation: `${res.azureAd.officeLocation || 'Jørgen jobbe jobbe'}`,
			navn: res.azureAd.manager.displayName
		}} />
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
