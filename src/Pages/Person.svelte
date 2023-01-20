<script>
	import { getPerson }  from '../lib/services/useApi'
	import { get } from 'svelte/store'
	import { searchParameter, prevUnit, clickedAcosLogon }  from '../lib/services/store'
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
	import { acosFlowProcessId } from '../../config'

	let personParameter

	let clickedAcos = get(clickedAcosLogon)

	clickedAcosLogon.subscribe(value => {
		clickedAcos = value
	})

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
	const mapKartlegginssamtaler = (samtaler) => {
		const allSamtaler = samtaler.filter(samtale => samtale.type === 'kartleggingssamtale-out')
		const res = allSamtaler.map(samtale => {
			const signedSamtale = samtaler.find(s => s.type === 'kartleggingssamtale-in' && s.managerApprovedTimestamp === samtale.timestamp)
			const signedStatus = signedSamtale?.approved ?? false
			return {
				...samtale,
				signedStatus: signedStatus === "Ja" ? '✅ Signert og godkjent av ansatt' : signedStatus === 'Nei' ? '❌ Signert, men ikke godkjent av ansatt' : 'Venter på godkjenning...',
				documentUrl: signedSamtale ? signedSamtale.documentUrl : samtale.documentUrl,
				documentNumber: signedSamtale ? signedSamtale.documentNumber : samtale.documentNumber,
			}
		})
		return res
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
				<!-- Validation of mandatory input fields if privileged -->
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
				{:else if res.isPrivileged}
					<p><span class="mandatoryInfo"><p>Det er ikke obligatorisk for denne ansatte å fylle ut sin kompetanse</span></p>
				{/if}
			</div>
			<!-- Kartleggings-tools -->
			{#if res.isPrivileged}
			<div class="kartleggingsContainer">
				<h3>Lederverktøy: Kartleggingssamtale</h3>
				<br />
				{#if !clickedAcos}
					<p class="notification"><strong>OBS!</strong> For å kunne overføre data til det digitale skjemaet for kartleggingssamtale, må du først logge på skjemaløsningen. Klikk på knappen under, logg på, og gå tilbake til denne fanen når du har logget på - da vil du kunne opprette kartleggingssamtale.</p>
				{/if}
				<div class="kartleggingsInfo">
					<div class="buttonContainer">
						{#if clickedAcos}
							<a class="action" href="https://internskjema.vtfk.no/skjema/VTFK0236/?prosessId={acosFlowProcessId}&employeeUpn={res.userPrincipalName}" target="_blank">Opprett kartleggingssamtale for {res.navn}</a>
						{:else}
							<a on:click={() => clickedAcosLogon.set(true)} class="action" href="https://internskjema.vtfk.no" target="_blank">Logg på internskjema.vtfk.no</a>
							<p class="action disabled">Logg på først for å opprette kartleggingssamtale for {res.navn}</p>
						{/if}
					</div>
					<div class="kartlegginsgsHistory">
						<h3>Historikk</h3>
						{#if res.kartleggingsSamtaler.length === 0}
							<em>Ingen tidligere kartleggingssamtaler registrert</em>
						{/if}
						{#each mapKartlegginssamtaler(res.kartleggingsSamtaler) as samtale}
							<div class="samtale">
								<p><strong>{samtale.schemaName} - {samtale.timestamp.substring(0,10)}</strong></p>
								<p><strong>Status: </strong>{samtale.signedStatus}</p>
								<p><strong>Ansvarlig for samtalen: </strong>{samtale.manager}</p>
								{#if samtale.documentUrl.startsWith('https://')}
									<p><a href="{samtale.documentUrl}" target="_blank">Klikk her for å åpne dokument {samtale.documentNumber} i Public 360 {'->'}</a></p>
								{:else}
									<p>Arkivstatus: {samtale.documentUrl}</p>
								{/if}
							</div>	
						{/each}
					</div>
				</div>
			</div>
			<!-- End Kartleggings-tools -->
			{/if}
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
	.action {
		display: block;
		border: 2px solid black;
		cursor: pointer;
		border-radius: 0.5rem; /* Skal vi ha border radius???? */
		text-decoration: none;
		color: black;
		padding: 8px;
		margin-bottom: 8px;
		max-width: 400px;
		text-align: center;
  }
	.action.disabled {
		cursor: not-allowed;
		background-color: var(--lightGrey);
		color: grey;
	}
	.action.disabled:hover {
		background-color: var(--lightGrey);
	}

  .action:hover {
    background-color: var(--lightBlue);
  }
	.kartleggingsContainer {
		padding: 16px;
		margin: 32px 0;
		background-color: var(--catSkillWhite);
		border-radius: 16px;
	}
	.kartleggingsInfo {
		margin-top: 8px;
		display: flex;
		gap: 64px;
		flex-wrap: wrap;
	}
	.notification {
		border: 1px solid black;
		padding: 16px;
		margin-bottom: 32px;
		background-color: var(--ecruWhite);
	}
	.samtale {
		padding: 4px 0;
		margin-bottom: 16px;
		border-bottom: 1px solid black;
	}

</style>
