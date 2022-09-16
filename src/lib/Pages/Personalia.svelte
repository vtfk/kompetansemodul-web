<script>
	import { getMe }  from '../services/useApi'
	import PersonCard from '../components/PersonCard.svelte'
</script>

<div class="content">
	{#await getMe()}
	<p>...Lastær</p>
	{:then res}
		<PersonCard personData={{
			name: `${res.fornavn} ${res.etternavn}`,
			email: res.kontaktEpostadresse,
			mainPosition: res.harAktivtArbeidsforhold ? res.aktiveArbeidsforhold.find(forhold => forhold.lonnsprosent > 0 && forhold.hovedstilling).stillingstittel : 'Dagdranker',
			officeLocation: `${res.azureAd.officeLocation || 'Jørgen jobbe jobbe'}`,
			navn: res.azureAd.manager.displayName
		}} />

		<h3>Overordnet</h3>
		<p>{res.azureAd.manager.displayName}</p>
		
		<h3>Aktive arbeidsforhold</h3>
		<ol>
			{#each res.aktiveArbeidsforhold as arbeidsforhold}
				<li>{arbeidsforhold.arbeidssted.navn} ({arbeidsforhold.stillingstittel})</li>
			{/each}
		</ol>

		<h3>Tidligere arbeidsforhold</h3>
		<ol>
			{#each res.tidligereArbeidsforhold as arbeidsforhold}
				<li>{arbeidsforhold.arbeidssted.navn} ({arbeidsforhold.stillingstittel})</li>
			{/each}
		</ol>

		<h3>Diverse</h3>
		<p>
			Personalressurskategori: {res.personalressurskategori.navn}<br />
			Ansettelsesperiode: {res.ansettelsesperiode.start} -> {res.ansettelsesperiode.slutt || 'Ikke angitt'}<br />
			Ansattnummer: {res.ansattnummer}
		</p>
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
