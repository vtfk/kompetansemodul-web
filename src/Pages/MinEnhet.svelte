<script>
	import { getOrg }  from '../lib/services/useApi'
	import { changePage }  from '../lib/Helpers/changePage'
	import IconSpinner from '../components/Icons/IconSpinner.svelte'
    import EmployeeBox from '../components/EmployeeBox.svelte'
	import { msalClientStore, unitParameter } from '../lib/services/store'
	import { get } from 'svelte/store'
  	import Button from '../components/Button.svelte'
    import SoloRoleStats from '../components/SoloRoleStats.svelte'
	import CountyStats from '../components/CountyStats.svelte'

	// State
	let activeUnit
	let chosenUnit
	let expandedView = false
	let showStats = false
	let useOnlyUnitStats = false
	let allStats = []
	let onlyUnitStats = []

	unitParameter.subscribe(value => {
		activeUnit = value
	})

	const getMyOrgUnit = async (unit) => {
		hideStats()
		let res
		if (unit === 'myUnit') {
			const msalClient = get(msalClientStore)
			const accounts = msalClient.getAllAccounts()
			res = await getOrg(accounts[0].username)
		} else {
			res = await getOrg(unit)
		}
		return res
	}

	const isUnitLeader = (leaderUpn) => {
		const msalClient = get(msalClientStore)
		const accounts = msalClient.getAllAccounts()
		if (leaderUpn === accounts[0].username) return true
		return false
	}

	// Checks if leader also has employement in the same unit, or is only leader
	const getLeaderEmployeeData = (unit) => {
		const employment = unit.arbeidsforhold.find(forhold => forhold.userPrincipalName === unit.leder.userPrincipalName)
		if (employment) return employment
		else return {
			...unit.leder,
			stillingstittel: 'Leder',
			leaderWithoutRelation: true,
			tasks: ['Leder']
		}
	}
	
	const getStats = async (orgId) => {
		const res = await getOrg(`report-${orgId}`)
		allStats = JSON.parse(JSON.stringify(res))
		onlyUnitStats = JSON.parse(JSON.stringify(res.filter(org => orgId === org.organisasjonsId)))		
		return true
	}

	// Reset stats when changing org unit
	const hideStats = () => {
		useOnlyUnitStats = false
		showStats = false
	}
	
</script>

<div class="content">
	{#await getMyOrgUnit(activeUnit)}
		<p><IconSpinner width="2rem" /></p>
	{:then units}
		{#if units.length > 1 && !chosenUnit}
			<h3>Du er tilknyttet flere enheter, vennligst velg den du ønsker å se</h3>
			{#each units as unit}
				<p class="link" on:click={() => {changePage('minenhet', { setUnit: unit.organisasjonsId })}}>
					{unit.navn}<strong>{isUnitLeader(unit.leder.userPrincipalName) ? ' (Leder)' : ''}</strong>
				</p>
			{/each}
		{:else}
			{#each units as unit}
				{#if unit.overordnet && unit.overordnet.organisasjonsId !== unit.organisasjonsId}
					<p class="link center" on:click={() => {changePage('minenhet', { setUnit: unit.overordnet.organisasjonsId })}}>{unit.overordnet.navn}</p>
				{/if}
				<h2 class="unitHeader center">{unit.navn}</h2>
				{#if unit.underordnet.length > 0}
					<h3 class="center">Underenheter</h3>
					<div class="center childrenContainer">
						{#each unit.underordnet as kid}
							<p class="link center" on:click={() => {changePage('minenhet', { setUnit: kid.organisasjonsId })}}>{kid.navn}</p>
						{/each}
					</div>
				{/if}
				{#if unit.isPrivileged}
					<div>
						<div class="unitHeader flexMe">
							<h3>Statistikk</h3>
						</div>
					</div>
					{#if showStats === true}
						{#await getStats(unit.organisasjonsId)}
							<div class="centerButton">
								<Button onlyIcon={true} size="large" buttonText="Laster... "><IconSpinner slot="after"  width="2rem"/></Button>
							</div>
						{:then}
							<div class="centerButton">
								<Button buttonText="Lukk statistikk" removeSlots={true} size="large" onClick={() => hideStats()}></Button>
							</div>
							{#if unit.underordnet.length > 1 }
								<div class="toggleFilterContainer">
									<label class="toggleFilter" for={unit}>Ikke inkluder underenheter i statistikk</label><input id={unit} type="checkbox" on:click={() => useOnlyUnitStats = !useOnlyUnitStats} >
								</div>
							{/if}

							<!-- Her kan vi putte inn komponenter for statistikk -->
							<div class="charts">
								<SoloRoleStats data={ { allStats, onlyUnitStats } } useOnlyUnitStats={useOnlyUnitStats} />
								<CountyStats data={ { allStats, onlyUnitStats } } useOnlyUnitStats={useOnlyUnitStats} />
							</div>
						{/await}
					{:else}
						<div class="centerButton">
							<Button buttonText="Hent statistikk" removeSlots={true} size="large" onClick={() => showStats = true}></Button>
						</div>
					{/if}
				{/if}
				{#if unit.arbeidsforhold.length > 0 || unit.leder.userPrincipalName}
					<div class="unitHeader flexMe">
						<h3>Ansatte</h3>
						<div class="toggleView"><div class="toggleContainer"><label for="toggle">Utvidet visning</label><input id="toggle" type="checkbox" bind:checked={expandedView} /></div></div>
					</div>
					<div class="employeeContainer">
						<EmployeeBox expandedView={expandedView} onClick={() => changePage('person', { setPerson: unit.leder.ansattnummer, setPrevious: { activeUnit, name: unit.navn } } )} employeeData={{ ...getLeaderEmployeeData(unit), isPrivileged: unit.isPrivileged, department: unit.navn}} />
						{#each unit.arbeidsforhold.filter(employee => employee.userPrincipalName !== unit.leder.userPrincipalName) as emp, i}
							<EmployeeBox expandedView={expandedView} onClick={() => changePage('person', { setPerson: emp.userPrincipalName, setPrevious: { activeUnit, name: unit.navn } })} employeeData={{...emp, department: unit.navn, isPrivileged: unit.isPrivileged}} />
						{/each}
					</div>
				{/if}
			{/each}
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	.employeeContainer {
		display: flex;
		gap: 23px;
		flex-wrap: wrap;
	}
	.childrenContainer {
		padding-bottom: 2rem;
	}
	.unitHeader {
		padding: 0 0 0.5rem 0;
		border-bottom: 1px solid var(--greyTone);
		margin-bottom: 1rem;
	}
	.unitHeader.flexMe {
		display: flex;
		justify-content: center;
		padding-top: 16px;
	}
	.center {
		text-align: center;
	}
	.centerButton {
		display: flex;
		justify-content: center;
	}
	.toggleContainer {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.toggleView {
		position: absolute;
		right: 0px;
	}

	.charts {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.toggleFilterContainer {
		display:flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: center;
		padding-top: 1rem;
	}

	.toggleFilter {
		display: flex;
		padding-right:0.5rem;
	}

	@media(max-width: 1183px) { 
		.stackedBarTop {
			padding-top: 12rem;
		}
		.charts {
			justify-content: space-around;
		}
	}
</style>
