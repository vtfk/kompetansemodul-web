<script>
	import { getMe/* , vitnemaal */ }  from '../lib/services/useApi'
	import { get } from 'svelte/store'
	import { editingPersonalia, prevUnit } from '../lib/services/store'
	import EmployeeCard from '../components/EmployeeCard.svelte'
	import IconSpinner from '../components/Icons/IconSpinner.svelte';
	import EducationCard from '../components/EducationCard.svelte';
	import DivCard from '../components/DivCard.svelte';
	import ExperienceCard from '../components/ExperienceCard.svelte';
	import PositionsCard from '../components/PositionsCard.svelte';
	import WorkExperienceCard from '../components/WorkExperienceCard.svelte';
	import IconHelp from '../components/Icons/IconHelp.svelte';
	import InfoBox from '../components/InfoBox.svelte';
	import EmployeeInfoCard from '../components/EmployeeInfoCard.svelte';
	import CountySelectionCard from '../components/CountySelectionCard.svelte'
	import CertificationCard from '../components/CertificationCard.svelte'
	import { personaliaHelp } from '../lib/Helpers/helptexts'
	import { changePage } from '../lib/Helpers/changePage'

	// State
	let showInfoBox = false

	// Mandatory fields validation
	let mandatoryFields = {
		tasksCompleted: false,
		perfCountyCompleted: false,
		soloRoleCompleted: false
	}
	const setFieldToFinished = (field, val) => {
		mandatoryFields[field] = val
		mandatoryFields = mandatoryFields
	}

	const getMee = async () => {
		const me = await getMe()
		return me
	}

	let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })
	let previousUnit = get(prevUnit)
    prevUnit.subscribe(value => {
        previousUnit = value
    })

</script>

<div class="content">
	{#await getMee()}
		<div class="loadingContainer">
			<span style="display: inline-block;"><IconSpinner width="200px" /></span>
		</div>
	{:then res}
		{#if previousUnit}
			<p on:click={() => changePage('minenhet', { setUnit: previousUnit.activeUnit } )}>⬅ { previousUnit.name }</p>
		{/if}
		<div class="pageIntro">
			{#if !editInfo.isEditing}
				<h2>Hei, {res.fornavn}! Her kan du se og redigere din kompetanse</h2>
				<div class="headerIcon" title={showInfoBox ? 'Lukk infoboks' : 'Åpne infoboks'} on:click={() => {showInfoBox = !showInfoBox}}><IconHelp /></div>
				<InfoBox content={personaliaHelp} html={true} open={showInfoBox} onClose={() => {showInfoBox = !showInfoBox}} />
			{:else}
				<h2>Redigerer {editInfo.editBlock}</h2>
			{/if}
		</div>
		<div>
			<!-- Validation of mandatory input fields -->
			{#if res.mandatoryCompetenceInput}
				{#if !mandatoryFields.tasksCompleted}
					<p class="mandatoryInfo">❗ Du har ikke fylt ut nøkkelopppaver i din stilling/stillinger</p>
				{/if}
				{#if !mandatoryFields.perfCountyCompleted}
					<p class="mandatoryInfo">❗ Du har ikke valgt "Ønsket fylkeskommune / arbeidssted etter oppdeling"</p>
				{/if}
				{#if !mandatoryFields.soloRoleCompleted}
					<p class="mandatoryInfo">❗ Du har ikke fylt ut "Er du den eneste med din stilling og/eller ansvarsområde i din enhet?"</p>
				{/if}
			{:else}
				<p>Det er ikke obligatorisk for deg å fylle ut din kompetanse - men du er hjertelig velkommen til å fylle ut det du ønsker 😀</p>
			{/if}
		</div>
		<!--<p style="color: var(--deepSeaGreen);"><strong>Til dagens seksjonsledermøte:</strong> Klikk her: <a href ="mailto:jorgen.thorsnes@vtfk.no;robin.ellingsen@vtfk.no?subject=Tilbakemelding på kompetanse-verktøy"> Lag tilbakemeldings-epost.</a> Skriv inn tilbakemeldinger i e-posten som åpnes, og send når du er ferdig å teste</p><br/> -->
		<EmployeeCard employeeData={res} />
		<EmployeeInfoCard employeeData={res} />
		<PositionsCard employeeData={res} competence={res.competenceData} setFieldToFinished={setFieldToFinished} />
		<CountySelectionCard competence={res.competenceData} setFieldToFinished={setFieldToFinished} />
		<DivCard competence={res.competenceData} setFieldToFinished={setFieldToFinished} />
		<WorkExperienceCard competence={res.competenceData} />
		<EducationCard competence={res.competenceData} />
		<CertificationCard competence={res.competenceData} />
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
	.mandatoryInfo {
		font-style: italic;
	}
	.mandatoryInfo:last-child {
		margin-bottom: 24px;
	}
</style>
