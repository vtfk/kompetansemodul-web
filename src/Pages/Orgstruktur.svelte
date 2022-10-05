<script>
	import { getOrg }  from '../lib/services/useApi'
	import { displayedPage, searchParameter } from '../lib/services/store'

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
						{#if employee.lonnsprosent > 0}
							<p on:click={() => { searchParameter.set(employee.userPrincipalName); displayedPage.set('person') } } style="color: green">{employee.navn}</p>
						{/if}
					{/each}
			{/each}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

</div>

<style>
</style>
