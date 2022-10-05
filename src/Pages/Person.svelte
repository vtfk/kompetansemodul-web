<script>
	import { getPerson }  from '../lib/services/useApi'
	import { searchParameter }  from '../lib/services/store'
	import EmployeeCard from '../components/EmployeeCard.svelte'
    import Button from '../components/Button.svelte';
    import IconSpinner from '../components/Icons/IconSpinner.svelte';

	let personParameter

	searchParameter.subscribe(value => {
		personParameter = value
	})

</script>

<div class="content">
	{#if personParameter}
		<h2>Ansattinformasjon</h2>
		{#await getPerson(personParameter)}
		<p><IconSpinner width="2rem" /></p>
		{:then res}
			<EmployeeCard employeeData={res} />
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{:else}
		<h2>Søk opp en ansatt, da vel!</h2>
	{/if}
</div>

<style>
</style>
