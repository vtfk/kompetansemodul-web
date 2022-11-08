<script>
	import { getOrg }  from '../lib/services/useApi'
	import { changePage }  from '../lib/Helpers/changePage'
	import IconSpinner from '../components/Icons/IconSpinner.svelte';
    import EmployeeBox from '../components/EmployeeBox.svelte';
	import { msalClientStore, unitParameter } from '../lib/services/store'
	import { get } from 'svelte/store'

	// State
	let activeUnit
	let chosenUnit
	let expandedView = false

	unitParameter.subscribe(value => {
		activeUnit = value
	})

	const getMyOrgUnit = async (unit) => {
		let res
		if (unit === 'myUnit') {
			const msalClient = get(msalClientStore)
			const accounts = msalClient.getAllAccounts()
			res = await getOrg(accounts[0].username)
		} else {
			res = await getOrg(unit)
		}
		console.log(res)
		return res
	}

</script>

<div class="content">
	{#await getMyOrgUnit(activeUnit)}
	<p><IconSpinner width="2rem" /></p>
	{:then units}
		{#if units.length > 1 && !chosenUnit}
			<h3>Du er ansatt i flere enheter, vennligst velg den du ønsker å se</h3>
			{#each units as unit}
				<p class="unitChoose" on:click={() => {changePage('minenhet', { setUnit: unit.organisasjonsId })}}>{unit.navn}</p>
			{/each}
		{:else}
			{#each units as unit}
				{#if unit.overordnet && unit.overordnet.organisasjonsId !== unit.organisasjonsId}
					<p class="unitChoose center" on:click={() => {changePage('minenhet', { setUnit: unit.overordnet.organisasjonsId })}}>{unit.overordnet.navn}</p>
				{/if}
				<h2 class="unitHeader center">{unit.navn}</h2>
				{#if unit.underordnet.length > 0}
					<h3 class="center">Underenheter</h3>
					<div class="center childrenContainer">
						{#each unit.underordnet as kid}
							<p class="unitChoose center" on:click={() => {changePage('minenhet', { setUnit: kid.organisasjonsId })}}>{kid.navn}</p>
						{/each}
					</div>
				{/if}
				{#if unit.arbeidsforhold.length > 0 || unit.leder.userPrincipalName}
					<div class="unitHeader flexMe">
						<h3>Ansatte</h3>
						<div class="toggleView"><div class="toggleContainer"><label for="toggle">Utvidet visning</label><input id="toggle" type="checkbox" bind:checked={expandedView} /></div></div>
					</div>
					<div class="employeeContainer">
						<EmployeeBox expandedView={expandedView} onClick={() => changePage('person', { setPerson: unit.leder.ansattnummer })} employeeData={{ ...unit.leder, stillingstittel: (unit.arbeidsforhold.find(forhold => forhold.userPrincipalName === unit.leder.userPrincipalName)?.stillingstittel ?? 'Leder'), tasks: (unit.arbeidsforhold.find(forhold => forhold.userPrincipalName === unit.leder.userPrincipalName)?.tasks ?? ['Leder']),  department: unit.navn}} />
						{#each unit.arbeidsforhold.filter(employee => employee.userPrincipalName !== unit.leder.userPrincipalName) as emp, i}
							<EmployeeBox expandedView={expandedView} onClick={() => changePage('person', { setPerson: emp.userPrincipalName })} employeeData={{...emp, department: unit.navn}} />
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
	.toggleContainer {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.unitChoose {
		color: #005260;
		cursor: pointer;
	}
	.toggleView {
		position: absolute;
		right: 0px;
	}

	.unitChoose:hover {
		text-decoration: underline;
		color: #005260;
	}

</style>
