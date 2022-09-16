<script>
	import { getPerson }  from '../lib/services/useApi'
	import { searchUpn }  from '../lib/services/store'
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
			navn: res.azureAd.manager.displayName,
			res
		}} />

		<h3>Overordnet</h3>
		<p>{res.azureAd.manager.displayName}</p>
		
		<h3>Aktive arbeidsforhold</h3>
		<ol>
			{#each res.aktiveArbeidsforhold as arbeidsforhold}
				<li>{arbeidsforhold.arbeidssted.navn} ({arbeidsforhold.stillingstittel})</li>
			{/each}
		</ol>

		<h3>Diverse</h3>
		<p>
			Personalressurskategori: {res.personalressurskategori.navn}<br />
			Ansettelsesperiode: {res.ansettelsesperiode ? res.ansettelsesperiode.start : 'Ikke angitt'} -> {res.ansettelsesperiode ? res.ansettelsesperiode.slutt || 'Ikke angitt' : 'Ikke angitt'}
		</p>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
</style>
