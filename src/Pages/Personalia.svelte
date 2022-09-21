<script>
	import { getMe, saveCompetence }  from '../lib/services/useApi'
	import EmployeeCard from '../components/EmployeeCard.svelte'
	import PosistionsCard from '../components/PositionsCard.svelte'
	import EducationCard from '../components/EducationCard.svelte'
	import WorkExperienceCard from '../components/WorkExperienceCard.svelte'

	let competence = {
		preOfficeLocation: '',
		prefferedCounty: '',
		education: [],
		workExperience: []
	}

	let newEducation = {}

	const addEducation = () => {
		// need to assign as a new object to make it "reactive"
		competence.education = [ ...competence.education, newEducation ]

		newEducation = {}
	}
	
	const removeEducation = brukernavn => {
		competence.education = competence.education.filter(education => education.brukernavn !== brukernavn)
	}

	const getMee = async () => {
		const me = await getMe()
		competence.fodselsnummer = me.fodselsnummer
		if (me.competenceData) {
			if (me.competenceData.education) {
				competence.education = me.competenceData.education
			}

			if (Array.isArray(me.tidligereArbeidsforhold) && me.tidligereArbeidsforhold.length > 0) {
				competence.workExperience = me.tidligereArbeidsforhold
			}

			competence.preOfficeLocation = me.competenceData.preOfficeLocation
			competence.prefferedCounty = me.competenceData.prefferedCounty
		}

		console.log(me)
		return me
	}

	const saveCompetencee = async () => {
		try {
			await saveCompetence(competence)
			console.log('Detta gikk så fint så :)')
		} catch (error) {
			console.error('Aiaiaiai:', error)
		}
	}
</script>

<div class="content">
	{#await getMee()}
	<p>...Lastær me</p>
	{:then res}
		<div class="pageIntro">
			<h2>Hei, {res.fornavn}! Dette er informasjon om deg.</h2>
			<p><em>Her kan du gjøre ditten og datten</em></p>
		</div>
		<EmployeeCard employeeData={res} />
		<PosistionsCard positions={res.tidligereArbeidsforhold} />
		<EducationCard competence={res.competenceData} />
		<WorkExperienceCard competence={res.competenceData} />
		<!--
		<pre>{JSON.stringify({ ...competence.education, preOfficeLocation: competence.preOfficeLocation, prefferedCounty: competence.prefferedCounty }, null, 2)}</pre>
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
			{#each competence.workExperience as arbeidsforhold}
				<li>{arbeidsforhold.arbeidssted.navn} ({arbeidsforhold.stillingstittel})</li>
			{/each}
		</ol>

		<h1>Utdanning</h1>
		<div>

			{#each competence.education as education}
				<input type="text" bind:value={education.brukernavn} /><br />
				<input type="text" bind:value={education.fornavn} /><br />
				<input type="text" bind:value={education.etternavn} /><br />
				<button on:click={() => removeEducation(education.brukernavn)}>Fjern meg</button><br /><br />
			{/each}

			Ny Utdanning<br />
			<input type="text" bind:value={newEducation.brukernavn} /><br />
			<input type="text" bind:value={newEducation.fornavn} /><br />
			<input type="text" bind:value={newEducation.etternavn} /><br />
			<button on:click={() => addEducation()}>Legg meg til</button><br /><br />

		<h1>Arbeidsplass</h1>
			<input type="text" bind:value={competence.preOfficeLocation} /><br />
			<input type="text" bind:value={competence.prefferedCounty} /><br /><br />

			<button on:click={() => saveCompetencee()}>Lagre det nye meg</button>
		</div>

		<h3>Diverse</h3>
		<p>
			Personalressurskategori: {res.personalressurskategori.navn}<br />
			Ansettelsesperiode: {res.ansettelsesperiode ? `${res.ansettelsesperiode.start || 'What?'} -> ${res.ansettelsesperiode.slutt || 'Ikke angitt'}` : 'Du jobber ikke her 😬'}<br />
			Ansattnummer: {res.ansattnummer}
		</p>-->
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	.pageIntro {
		margin-bottom: 36px;
	}
</style>
