<script>
	import { getOrg }  from '../lib/services/useApi'
	import { structurizeOrg } from '../lib/Helpers/organizationTools'
    import IconSpinner from '../components/Icons/IconSpinner.svelte'
    import OrgUnit from '../components/OrgUnit.svelte'
	import { get } from 'svelte/store'
	import { allOrgStore }  from '../lib/services/store'

	// State
	let name = 'Vår organisasjon'
	let allOrg = []
	let structOrg = {}

	// Functions
	const getAllOrg = async () => {
		if (!get(allOrgStore)) {
			allOrg = await getOrg('allSmall')
			allOrgStore.set(allOrg)
		} else {
			allOrg = get(allOrgStore)
		}
		structOrg = structurizeOrg(allOrg)
	}

</script>
<div class="content">
	<h1>{name}</h1>
	{#await getAllOrg()}
		<p><IconSpinner /></p>
	{:then}
		<OrgUnit unit={structOrg[0]} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

</div>

<style>
	h1 {
		border-bottom: 1px solid var(--mork);
		margin-bottom: 16px;
	}
	.content {
		text-align: center;
	}
</style>
