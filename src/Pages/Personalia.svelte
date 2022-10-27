<script>
	import { getMe/* , vitnemaal */ }  from '../lib/services/useApi'
	import { get } from 'svelte/store'
  import { editingPersonalia, infoOpen } from '../lib/services/store'
	import EmployeeCard from '../components/EmployeeCard.svelte'
  import IconSpinner from '../components/Icons/IconSpinner.svelte';
  import EducationCard from '../components/EducationCard.svelte';
  import TasksCard from '../components/TasksCard.svelte';
  import DivCard from '../components/DivCard.svelte';
  import ExperienceCard from '../components/ExperienceCard.svelte';
  import PositionsCard from '../components/PositionsCard.svelte';
  import WorkExperienceCard from '../components/WorkExperienceCard.svelte';
  import IconHelp from '../components/Icons/IconHelp.svelte';
  import InfoBox from '../components/InfoBox.svelte';
  import EmployeeInfoCard from '../components/EmployeeInfoCard.svelte';
	import CountySelection from '../components/CountySelection.svelte'

	// State
	let showInfoBox = false
	let infoContent = "<h4>Hvorfor samler vi inn din kompetanse på denne måten?</h4><p>Vi ønsker en digital oversikt over kompetansen til ansatte i fylkesadministrasjonen. Intensjonen er å jobbe systematisk med rekruttering og kompetanseutvikling i både VTFK og de nye organisasjonene. Kompetansekartlegging er et verktøy for å anta om to nye fylkeskommuner personalmessig vil være i stand til å løse sitt samfunnsoppdrag</p> <br><p>Husk at du også finner informasjon om kartleggingsverktøyet, GDPR og hva informasjon skal brukes til på Innsida, i personvernerklæringen og i andre informasjonskanaler. Dersom du har spørsmål eller noe er uklart er du alltid velkommen til å kontakte  (sett inn kontaktopplysninger).</p" // TODO: Define contact information

	const getMee = async () => {
		const me = await getMe()
		console.log(me)
		return me
	}

	let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

</script>

<div class="content">
	{#await getMee()}
		<div class="loadingContainer">
			<span style="display: inline-block;"><IconSpinner width="200px" /></span>
		</div>
	{:then res}
		<div class="pageIntro">
			{#if !editInfo.isEditing}
				<h2>Hei, {res.fornavn}! Her kan du se og redigere din kompetanse</h2>
				<div class="headerIcon" title={showInfoBox ? 'Lukk infoboks' : 'Åpne infoboks'} on:click={() => {showInfoBox = !showInfoBox}}><IconHelp /></div>
				<InfoBox content={infoContent} html={true} open={showInfoBox} onClose={() => {showInfoBox = !showInfoBox}} />
			{:else}
				<h2>Redigerer {editInfo.editBlock}</h2>
			{/if}
		</div>
		<!-- <p style="color: var(--deepSeaGreen);"><strong>Til dagens workshop:</strong> Klikk her: <a href ="mailto:jorgen.thorsnes@vtfk.no;robin.ellingsen@vtfk.no?subject=Tilbakemelding på kompetanse-verktøy&body=Eksempler på hva vi ønsker tilbakemelding på:%0D%0A-Hva er vanskelig å forstå?%0D%0A-Er det noe du føler mangler?%0D%0A-Er det noe som ikke fungerer som forventet?%0D%0A-Er det noe du liker godt?%0D%0A-Er det noe du ikke liker?%0D%0A-Generelle tanker?%0D%0A%0D%0ASkriv inn her:"> Lag tilbakemeldings-epost.</a> Skriv inn tilbakemeldinger i e-posten som åpnes, og send når du er ferdig å teste</p><br/>  -->
		<EmployeeCard employeeData={res} />
		<EmployeeInfoCard employeeData={res} />
		<PositionsCard employeeData={res} competence={res.competenceData} />
		<TasksCard competence={res.competenceData}/>
		<CountySelection competence={res.competenceData}/>
		<DivCard competence={res.competenceData}/>
		<WorkExperienceCard competence={res.competenceData} />
		<EducationCard competence={res.competenceData} />
		<ExperienceCard competence={res.competenceData}/>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	.loadingContainer {
		width: 100%;
		text-align: center;
	}
	.pageIntro {
		margin-bottom: 36px;
		display: flex;
		flex-wrap: wrap;
	}
	.headerIcon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		width: 1.6rem;
		margin-left: 4px;
	}
	.headerIcon:hover {
		cursor: pointer;
		transform: scale(1.2);
	}
</style>
