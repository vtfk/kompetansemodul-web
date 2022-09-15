<script>
	import { getOrg }  from '../services/useApi'
	import { displayedPage, searchUpn } from '../services/store'

	let name = 'Organisasjon'
</script>
<div class="content">
	<h1>{name}!</h1>
	<p>Her er vår org </p>
	{#await getOrg()}
	<p>...Lastær</p>
	{:then res}
		{#each res as unit}
			<p>{unit.navn}</p>
			{#each unit.arbeidsforhold as employee}
				<p on:click={() => { searchUpn.set(employee.userPrincipalName); displayedPage.set('person') } } style="color: green">{employee.navn}</p>
			{/each}
		{/each}
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