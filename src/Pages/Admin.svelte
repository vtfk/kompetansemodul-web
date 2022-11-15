<script>
	import { getOrg, getSettings, saveSettings }  from '../lib/services/useApi'
    import IconSpinner from '../components/Icons/IconSpinner.svelte';
    import AdminUnit from '../components/AdminUnit.svelte';
    import Button from '../components/Button.svelte';
    import IconCheck from '../components/Icons/IconCheck.svelte';

	let name = 'Administrator'
	let org = []
	let filteredOrg = []
	let employees = []
	let employeeCategories = []
	let structuredOrg = []
	let adminSettings = {
		oblig: {
			chosenCategories: [],
			chosenUnits: [],
			chosenEmployees: [],
			onlyAfterSplitt: false,
			chosenUnitsWithChildren: []
		}
	}

	let isSaving = false

	let activeSetting = null
	const settings = [
		{
			title: "Definer hvem som må fylle inn sin kompetanse",
			id: "oblig"
		}
	]
	
	const getCategories = (unit) => {
		for (const forhold of unit.arbeidsforhold) {
			if (!employeeCategories.includes(forhold.personalressurskategori.navn)) employeeCategories.push(forhold.personalressurskategori.navn)
		}
	}
	const getEmployees = (units) => {
		employees = []
		for (const unit of units) {
			for (const forhold of unit.arbeidsforhold) {
				if (!employees.find(emp => emp.userPrincipalName === forhold.userPrincipalName)) employees.push(forhold)
			}
		}
		employees = employees
	}

	const structurizeOrg = (units) => {
		for (const unit of units) {
			unit.underordnet = unit.underordnet.map(child => {
				if (!units.find((u => u.organisasjonsId === child.organisasjonsId))) return null // These are unit with gyldighetsperiode slutt
				return units.find(u => u.organisasjonsId === child.organisasjonsId)
			}).filter(u => u !== null) // Filter out units with gyldighetsperiode slutt
		}
		return [units.find(unit => unit.organisasjonsId === 'hoved')]
	} 

	const getOrgs = async () => {
		org = await getOrg('all')
		filteredOrg = JSON.parse(JSON.stringify(org))
		// Fetch admin settings
		for (const unit of org) {
			getCategories(unit)
		}
		toggleCategory(null)
		return true
	}

	const toggleCategory = (cat) => {
		if (cat) {
			if (adminSettings.oblig.chosenCategories.includes(cat)) {
				adminSettings.oblig.chosenCategories = adminSettings.oblig.chosenCategories.filter(category => category !== cat)
			} else {
				adminSettings.oblig.chosenCategories.push(cat)
				adminSettings.oblig.chosenCategories = adminSettings.oblig.chosenCategories
			}
		}
		for (let i=0; i<org.length; i++) {
			filteredOrg[i].arbeidsforhold = org[i].arbeidsforhold.filter(forhold => (adminSettings.oblig.chosenCategories.includes(forhold.personalressurskategori.navn)) && ((adminSettings.oblig.chosenCategories.includes('datoFilter') && (!forhold.arbeidsforholdsperiode.slutt || new Date('2023-12-31T00:00:00Z') < new Date(forhold.arbeidsforholdsperiode.slutt) )) || !adminSettings.oblig.chosenCategories.includes('datoFilter')))
		}
		getEmployees(filteredOrg)
	}

	const getChosen = (arbeidsforhold, chosenEmployees) => {
		const res = []
		for (const forhold of arbeidsforhold) {
			if (chosenEmployees.find(emp => emp.userPrincipalName === forhold.userPrincipalName)) {
				res.push(forhold)
			}
		}
		return res
	}

	/*
	const chooseUnit = (unit) => {
		let add
		if (adminSettings.oblig.chosenUnits.find(u => u.organisasjonsId === unit.organisasjonsId)) {
			add = false
			adminSettings.oblig.chosenUnits = adminSettings.oblig.chosenUnits.filter(u => u.organisasjonsId !== unit.organisasjonsId)
		}
		else {
			add = true
			adminSettings.oblig.chosenUnits.push({ organisasjonsId: unit.organisasjonsId, navn: unit.navn })
		}
		for (const forhold of unit.arbeidsforhold) {
			if (add) {
				if (!adminSettings.oblig.chosenEmployees.find(emp => emp.userPrincipalName === forhold.userPrincipalName)) adminSettings.oblig.chosenEmployees.push(forhold)
			} else {
				adminSettings.oblig.chosenEmployees = adminSettings.oblig.chosenEmployees.filter(emp => emp.userPrincipalName !== forhold.userPrincipalName)
			}
		}
		adminSettings.oblig.chosenUnits = adminSettings.oblig.chosenUnits
		adminSettings.oblig.chosenEmployees = adminSettings.oblig.chosenEmployees
	}*/

	const chooseEmployee = (employee) => {
		if (!adminSettings.oblig.chosenEmployees.find(emp => emp.userPrincipalName === employee.userPrincipalName)) adminSettings.oblig.chosenEmployees.push(employee)
		else adminSettings.oblig.chosenEmployees = adminSettings.oblig.chosenEmployees.filter(emp => emp.userPrincipalName !== employee.userPrincipalName)
		
		adminSettings.oblig.chosenEmployees = adminSettings.oblig.chosenEmployees
	}

	const addUnit = (unit) => {
		for (const emp of unit.arbeidsforhold) {
			if (!adminSettings.oblig.chosenEmployees.find(e => e.userPrincipalName === emp.userPrincipalName)) adminSettings.oblig.chosenEmployees.push(emp)
		}
		if (!adminSettings.oblig.chosenUnits.find(u => u.organisasjonsId === unit.organisasjonsId)) adminSettings.oblig.chosenUnits.push({ organisasjonsId: unit.organisasjonsId, navn: unit.navn, kortnavn: unit.kortnavn, leder: unit.leder.userPrincipalName })
		adminSettings.oblig.chosenEmployees = adminSettings.oblig.chosenEmployees
		adminSettings.oblig.chosenUnits = adminSettings.oblig.chosenUnits
	}

	const removeUnit = (unit) => {
		for (const emp of unit.arbeidsforhold) {
            adminSettings.oblig.chosenEmployees = adminSettings.oblig.chosenEmployees.filter(e => e.userPrincipalName !== emp.userPrincipalName)
        }
		adminSettings.oblig.chosenUnits = adminSettings.oblig.chosenUnits.filter(u => u.organisasjonsId !== unit.organisasjonsId)
		adminSettings.oblig.chosenEmployees = adminSettings.oblig.chosenEmployees
	}

	const getAdminSettings = async () => {
		const res = await getSettings()
		adminSettings = res && res.length > 0 ? res[0] : {}
		delete adminSettings._id
		if (!adminSettings.oblig) adminSettings.oblig = {
			chosenCategories: [],
			chosenUnits: [],
			chosenEmployees: [],
			onlyAfterSplitt: false,
			chosenUnitsWithChildren: []
		}
		if (!adminSettings.oblig.chosenCategories) adminSettings.oblig.chosenCategories = []
		if (!adminSettings.oblig.chosenEmployees) adminSettings.oblig.chosenEmployees = []
		if (!adminSettings.oblig.chosenUnits) adminSettings.oblig.chosenUnits = []
		if (!adminSettings.oblig.chosenUnitsExpand) adminSettings.oblig.chosenUnitsWithChildren = []
		if (!adminSettings.oblig.onlyAfterSplitt) adminSettings.oblig.onlyAfterSplitt = false

	}

	const saveAdminSettings = async () => {
		isSaving = true
		try {
			const res = await saveSettings(adminSettings)
		} catch (error) {
		}
		isSaving = false
	}

	const datoGreieFilter = () => {
		adminSettings.oblig.onlyAfterSplitt = !adminSettings.oblig.onlyAfterSplitt
		toggleCategory('datoFilter')
	}

</script>
<div class="content">
	<h1>{name}</h1>
	{#if !activeSetting}
		<h2>Innstillinger</h2>
		{#await getAdminSettings()}
		<p><IconSpinner /></p>
		{:then res}
			{#each settings as setting}
				<p class="link" on:click={() => {activeSetting = setting.id}}>{setting.title}</p>
			{/each}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{:else}
		<p class="link" on:click={() => {activeSetting = null}}>{"<-Tilbake til innstillinger"}</p>
	{/if}
	<!-- Definer hvem som må fylle inn sin kompetanse -->
	{#if activeSetting === 'oblig'}
		{#await getOrgs()}
		<p><IconSpinner /></p>
		{:then res}
			<h2>Velg dato-filter</h2>
			<br />
			<div on:click={datoGreieFilter}>
				<label for="datoGreia">Kun ansatte med arbeidsforholdsperiode etter 01.01.2024?</label>
				<input type="checkbox" checked={adminSettings.oblig.onlyAfterSplitt}>
			</div>
			<h2>Velg kategori-filter</h2>
			<br />
			{#each employeeCategories as ec}
				<div class="option" on:click={() => { toggleCategory(ec) }}>
					<label for={ec}>{ec}</label><input id={ec} type="checkbox" checked={adminSettings.oblig.chosenCategories.includes(ec)} />
				</div>
			{/each}
			<div class="chooseAndSave">
				<h2>Velg enheter/personer som må legge inn data</h2>
				<br />
				{#if isSaving}
					<IconSpinner />
				{:else}
					<Button buttonText="Lagre innstillinger" onClick={saveAdminSettings} ><IconCheck slot="before" /></Button><br />
				{/if}
			</div>
			<p>{adminSettings.oblig.chosenEmployees.length} av {employees.length} ansatte valgt</p>
			<a href="mailto:{adminSettings.oblig.chosenUnits.map(u => u.leder).join(';')}">📧 Opprett e-post til ledere for valgte enheter</a>
			<a href="mailto:{adminSettings.oblig.chosenEmployees.map(e => e.userPrincipalName).join(';')}">📧 Opprett e-post til alle valgte ansatte</a>
			<AdminUnit unit={structurizeOrg(filteredOrg)[0]} adminSettings={adminSettings} getChosen={getChosen} chooseEmployee={chooseEmployee} addUnit={addUnit} removeUnit={removeUnit} />
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{/if}
</div>

<style>
	.chooseAndSave {
		display: flex;
		justify-content: space-between;
	}
	h2 {
		padding-top: 16px;
		border-bottom: 1px solid var(--mork);
	}
	.content {
		padding-bottom: 32px;
	}
	.option {
		display: flex;
		align-items: center;
		gap: 8px;
	}
</style>
