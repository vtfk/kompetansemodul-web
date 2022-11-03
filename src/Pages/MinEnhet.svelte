<script>
	import { getOrg }  from '../lib/services/useApi'
	import IconSpinner from '../components/Icons/IconSpinner.svelte';
    import EmployeeBox from '../components/EmployeeBox.svelte';
	import { msalClientStore } from '../lib/services/store'
	import { get } from 'svelte/store'

	const getMyOrgUnit = async () => {
		const msalClient = get(msalClientStore)
		const accounts = msalClient.getAllAccounts()
		const p = await getOrg(accounts[0].username)
		console.log(p)
		return p
	}

</script>

<div class="content">
	{#await getMyOrgUnit()}
	<p><IconSpinner width="2rem" /></p>
	{:then units}
		{#each units as unit}
			<h2 class="unitHeader">{unit.navn}</h2>
			<div class="employeeContainer">
				<EmployeeBox employeeData={{...unit.arbeidsforhold.find(forhold => forhold.userPrincipalName === unit.leder.userPrincipalName), department: unit.navn}} />
				{#each unit.arbeidsforhold.filter(employee => employee.userPrincipalName !== unit.leder.userPrincipalName) as emp}
					<EmployeeBox employeeData={{...emp, department: unit.navn}} />
				{/each}
			</div>
			<br /><br />
		{/each}
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
	.unitHeader {
		padding: 1rem 0 0.5rem 0;
		border-bottom: 1px solid var(--greyTone);
		margin-bottom: 1rem;
	}
</style>
