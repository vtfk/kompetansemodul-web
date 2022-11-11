<script>
	import { getPerson }  from '../lib/services/useApi'
	import { get } from 'svelte/store'
	import { searchParameter, prevUnit }  from '../lib/services/store'
	import EmployeeCard from '../components/EmployeeCard.svelte'
	import IconSpinner from '../components/Icons/IconSpinner.svelte';
	import PositionsCard from '../components/PositionsCard.svelte';
	import EmployeeInfoCard from '../components/EmployeeInfoCard.svelte';
	import { changePage } from '../lib/Helpers/changePage'

	let personParameter

	searchParameter.subscribe(value => {
		personParameter = value
	})
	let previousUnit = get(prevUnit)
    prevUnit.subscribe(value => {
        previousUnit = value
    })
	console.log(previousUnit)

	const getPersoon = async (personParameter) => {
		const p = await getPerson(personParameter)
		console.log(p)
		return p[0]
	}

	const isPrivileged = (isPrivileged) => {
		if(isPrivileged) return true
		if(!isPrivileged) return false
		
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
			<EmployeeCard employeeData={res} />
			{#if res.isPrivileged}
				<EmployeeInfoCard employeeData={res} disableInfoBox={true} hideTextBox={true} isPrivileged={isPrivileged(res.isPrivileged)}/>
				{console.log(res.isPrivileged)}
				<PositionsCard employeeData={res} competence={res.competenceData} canEdit={false} disableInfoBox={true} />
			{/if}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{:else}
		<h2>Søk opp en ansatt, da vel!</h2>
	{/if}
</div>

<style>
</style>
