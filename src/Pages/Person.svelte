<script>
	import { getPerson }  from '../lib/services/useApi'
	import { get } from 'svelte/store'
	import { searchParameter, prevUnit }  from '../lib/services/store'
	import EmployeeCard from '../components/EmployeeCard.svelte'
	import IconSpinner from '../components/Icons/IconSpinner.svelte';
	import PositionsCard from '../components/PositionsCard.svelte';
	import EmployeeInfoCard from '../components/EmployeeInfoCard.svelte';
	import { changePage } from '../lib/Helpers/changePage'
    import CountySelectionCard from '../components/CountySelectionCard.svelte';
    import WorkExperienceCard from '../components/WorkExperienceCard.svelte';
    import EducationCard from '../components/EducationCard.svelte';
    import CertificationCard from '../components/CertificationCard.svelte';
    import ExperienceCard from '../components/ExperienceCard.svelte';
	import DivCard from '../components/DivCard.svelte';

	let personParameter

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

	searchParameter.subscribe(value => {
		personParameter = value
	})
	let previousUnit = get(prevUnit)
    prevUnit.subscribe(value => {
        previousUnit = value
    })

	const getPersoon = async (personParameter) => {
		const p = await getPerson(personParameter)
		return p[0]
	}
</script>

<div class="content">
	{#if personParameter}
		{#if previousUnit}
			<p class="link" on:click={() => changePage('minenhet', { setUnit: previousUnit.activeUnit } )}>{"<-"}Tilbake til { previousUnit.name }</p>
		{/if}
		<h2>Ansattinformasjon</h2>
		{#await getPersoon(personParameter)}
			<p><IconSpinner width="2rem" /></p>
		{:then res}
			<div>
				<!-- Validation of mandatory input fields -->
				{#if res.mandatoryCompetenceInput && res.isPrivileged}
					{#if !mandatoryFields.tasksCompleted}
						<p>❗ <span class="mandatoryInfo">Har ikke fylt ut nøkkelopppaver i sin stilling/stillinger</span></p>
					{/if}
					{#if !mandatoryFields.perfCountyCompleted}
						<p>❗ <span class="mandatoryInfo">Har ikke valgt "Ønsket fylkeskommune / arbeidssted etter oppdeling"</span></p>
					{/if}
					{#if !mandatoryFields.soloRoleCompleted}
						<p>❗ <span class="mandatoryInfo">Har ikke fylt ut "Er du den eneste med din stilling og/eller ansvarsområde i din enhet?"</span></p>
					{/if}
				{/if}
			</div>
			<EmployeeCard employeeData={res} />
			{#if res.isPrivileged}
				<EmployeeInfoCard employeeData={res} disableInfoBox={true} hideTextBox={true} />
				<PositionsCard employeeData={res} competence={res.competenceData} canEdit={false} disableInfoBox={true} setFieldToFinished={setFieldToFinished} />
				<CountySelectionCard competence={res.competenceData} canEdit={false} disableInfoBox={true} setFieldToFinished={setFieldToFinished} />
				<DivCard competence={res.competenceData} canEdit={false} disableInfoBox={true} setFieldToFinished={setFieldToFinished} />
				<WorkExperienceCard competence={res.competenceData} canEdit={false} disableInfoBox={true} />
				<EducationCard competence={res.competenceData} canEdit={false} disableInfoBox={true} />
				<CertificationCard competence={res.competenceData} canEdit={false} disableInfoBox={true} />
				<ExperienceCard competence={res.competenceData} canEdit={false} disableInfoBox={true} />
			{/if}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{:else}
		<h2>Søk opp en ansatt, da vel!</h2>
	{/if}
</div>

<style>
	.mandatoryInfo {
		font-style: italic;
	}
	.mandatoryInfo:last-child {
		margin-bottom: 24px;
	}
</style>
