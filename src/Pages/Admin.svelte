<script>
	import { getOrg, getSettings, saveSettings, sendMail }  from '../lib/services/useApi'
  import IconSpinner from '../components/Icons/IconSpinner.svelte';
	import { msalClientStore } from '../lib/services/store'
	import { get } from 'svelte/store'
  import AdminUnit from '../components/AdminUnit.svelte';
  import Button from '../components/Button.svelte';
  import IconCheck from '../components/Icons/IconCheck.svelte';
	import { welcomeMail, remindMail } from '../lib/Helpers/mailTemplates'
	import { structurizeOrg } from '../lib/Helpers/organizationTools'
	import AllowInnplassering from '../components/AllowInnplassering.svelte';

	let name = 'Administrator'
	let org = []
	let filteredOrg = []
	let employees = []
	let employeeCategories = []
	let adminSettings = {
		oblig: {
			chosenCategories: [],
			chosenUnits: [],
			chosenEmployees: [],
			onlyAfterSplitt: false,
			chosenUnitsWithChildren: []
		}
	}
	let overview = {
		allOrgs: [],
		filteredOrgs: [],
		allEmployees: [],
		allLeaders: [],
		mandatoryAll: [],
		mandatoryLeaders: [],
		mandatoryEmployees: [],
		hasAnsweredAll: [],
		hasAnsweredLeaders: [],
		hasAnsweredEmployees: [],
		mandatoryUnits: [],
		hasAnsweredUnitLeaders: [],
		hasNotAnsweredUnitLeaders: []
	}

	const mailStatus = {
		welcome: {
			isSending: false,
			result: '',
			failed: []
		},
		remind: {
			isSending: false,
			result: '',
			failed: []
		},
		leader: {
			isSending: false,
			result: '',
			failed: []
		}
	}

	let isSaving = false

	let activeSetting = null
	const settings = [
		{
			title: "Definer hvem som må fylle inn sin kompetanse",
			id: "oblig"
		},
		{
			title: "Sjekk svaroversikt og send påminnelser",
			id: "overview"
		},
		{
			title: "Definer hvem som har lov til å innplassere",
			id: "allowInnplassering"
		}
	]

	const msalClient = get(msalClientStore)
	let currentUser = (msalClient.getAllAccounts())[0].username
	
	const hasAnsweredMandatory = (employee) => {
		if (!employee.perfCounty) return false
		if (!employee.soloRole) return false
		if (employee.positionTasks.length === 0) return false
		for (const pt of employee.positionTasks) {
			if (Array.isArray(pt.tasks) && pt.positionId.includes('--') && pt.tasks.length > 0) return true
		}
		return false
	}

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
		if (adminSettings?.oblig?.chosenEmployees) {
			adminSettings.oblig.chosenEmployees = adminSettings.oblig.chosenEmployees.filter(emp => employees.find(e => e.userPrincipalName === emp.userPrincipalName))
		}
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

	const getOrgsOverview = async () => {
		overview.allOrgs = await getOrg('allAdmin')
		overview.filteredOrgs = JSON.parse(JSON.stringify(overview.allOrgs))
		// Get all employees
		for (const unit of overview.allOrgs) {
			for (const employee of unit.arbeidsforhold) {
				if (!overview.allEmployees.find(e => employee.userPrincipalName === e.userPrincipalName)) overview.allEmployees.push(employee)
			}
		}
		// Get all leaders
		for (const unit of overview.allOrgs) {
			if (!overview.allLeaders.find(l => unit.leder.userPrincipalName === l.userPrincipalName)) overview.allLeaders.push(unit.leder)
		}
		overview.mandatoryAll = overview.allEmployees.filter(e => e.mandatoryCompetenceInput)
		overview.mandatoryLeaders = overview.allLeaders.filter(l => l.mandatoryCompetenceInput)
		overview.hasAnsweredAll = overview.mandatoryAll.filter(e => hasAnsweredMandatory(e))
		overview.hasNotAnsweredAll = overview.mandatoryAll.filter(e => !hasAnsweredMandatory(e))
		overview.hasAnsweredLeaders = overview.mandatoryLeaders.filter(l => hasAnsweredMandatory(l))
		overview.mandatoryUnits = overview.allOrgs.filter(unit => adminSettings.oblig.chosenUnits.find(u => u.organisasjonsId === unit.organisasjonsId))
		overview.hasAnsweredUnitLeaders = overview.mandatoryUnits.filter(u => hasAnsweredMandatory(u.leder))
		overview.hasNotAnsweredUnitLeaders = overview.mandatoryUnits.filter(u => !hasAnsweredMandatory(u.leder))
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

	const sendEmails = async (options, type) => {
		const confirmed = confirm(`Er du sikker på du ønsker å sende e-post til ${options.receivers.length} personer`)


		if (confirmed) {
			mailStatus[type].isSending = true
			mailStatus[type].failed = []
			let res
			try {
				/* // To test failed
				res = {
					failed: [
						{
							error: "tt",
							mail: {
								to: ['jij@fjdk.no']
							}
						},
						{
							error: "tt",
							mail: {
								to: ['jij@fjdkfdf.no']
							}
						}
					]
				} */
				res = await sendMail({
					receivers: options.receivers,
					emailSubject: options.template.subject,
					emailBody: options.template.body
				})
				if (res.failed.length > 0) {
					let retries = []
					for (const fail of res.failed) {
						retries = [...retries, ...fail.mail.to]
					}
					mailStatus[type].failed = retries
					res = `Ånei, utsendingen feilet for ${retries.length} personer!`
				} else {
					res = 'E-post er på vei! :)'
				}
			} catch (error) {
				res = 'Utsending feilet, prøv igjen'
			}
			mailStatus[type].isSending = false
			mailStatus[type].result = res
		}
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
			<AdminUnit unit={structurizeOrg(filteredOrg)[0]} adminSettings={adminSettings} getChosen={getChosen} chooseEmployee={chooseEmployee} addUnit={addUnit} removeUnit={removeUnit} />
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{/if}
	{#if activeSetting === 'overview'}
		{#await getOrgsOverview()}
			<p><IconSpinner /></p>
		{:then res}
			<h2>Svaroversikt</h2>
			<h3>Alle ansatte (inkludert ledere)</h3>
			<p>Har svart: { overview.hasAnsweredAll.length }/{ overview.mandatoryAll.length } </p>
			<p>Har ikke svart: { overview.hasNotAnsweredAll.length }/{ overview.mandatoryAll.length }</p>
			<p>Trenger ikke svare: { overview.allEmployees.length - overview.mandatoryAll.length }</p>
			<!--Welcome mail-->
			<div class="mailBox">
				{#if mailStatus.welcome.isSending}
					<IconSpinner />
				{:else if mailStatus.welcome.result.length > 0}
					<div class="mailMsg">{mailStatus.welcome.result}<span class="link" on:click={() => {mailStatus.welcome.result=""}}>&nbsp Lukk &nbsp</span></div>
					{#if mailStatus.welcome.failed.length > 0}
						<Button removeSlots={true} buttonText="🔄 Send velkomstmail til de det feilet på" onClick={ () => { sendEmails({ receivers: mailStatus.welcome.failed, template: welcomeMail }, 'welcome') } } />
					{/if}
				{:else}
					<Button disabled={true} removeSlots={true} buttonText="📧 Send velkomstmail" onClick={ () => { sendEmails({ receivers: overview.mandatoryAll.map(emp => emp.userPrincipalName), template: welcomeMail }, 'welcome') } } />
					<Button removeSlots={true} buttonText="📧 Test til deg selv: Send velkomstmail" onClick={ () => { sendEmails({ receivers: [currentUser], template: welcomeMail }, 'welcome') } } />
				{/if}
			</div>
			<!--Remind mail-->
			<div class="mailBox">
				{#if mailStatus.remind.isSending}
					<IconSpinner />
				{:else if mailStatus.remind.result.length > 0}
					<div class="mailMsg">{mailStatus.remind.result}<span class="link" on:click={() => {mailStatus.remind.result=""}}>&nbsp Lukk &nbsp</span></div>
					{#if mailStatus.remind.failed.length > 0}
						<Button removeSlots={true} buttonText="🔄 Send påminnelse til de det feilet på" onClick={ () => { sendEmails({ receivers: mailStatus.remind.failed, template: remindMail }, 'remind') } } />
					{/if}
				{:else}
					<Button disabled={true} removeSlots={true} buttonText="📧 Send påminnelse til de som ikke har fylt ut" onClick={ () => { sendEmails({ receivers: overview.hasNotAnsweredAll.map(emp => emp.userPrincipalName), template: remindMail }, 'remind') } } />
					<Button removeSlots={true} buttonText="📧 Test til deg selv: Send påminnelse til de som ikke har fylt ut" onClick={ () => { sendEmails({ receivers: [currentUser], template: remindMail }, 'remind') } } />
				{/if}
			</div>
			<br />
			<h3>Svarprosent ledere i enheter som skal svare</h3>
			<p>{Math.ceil(overview.hasAnsweredUnitLeaders.length / overview.mandatoryUnits.length * 100)}%</p>
			<br />
			<h3>Enheter/Ledere</h3>
			{#each overview.hasNotAnsweredUnitLeaders as unit}
				<p><strong>{unit.navn}</strong> - Leder: {unit.leder.navn} - <em>Ikke svart</em> ❌</p>
			{/each}
			{#each overview.hasAnsweredUnitLeaders as unit}
				<p><strong>{unit.navn}</strong> - Leder: {unit.leder.navn} - <em>Har svart</em> ✅</p>
			{/each}
			<!--
			<h3>Ledere</h3>
			<p>Har svart: { overview.hasAnsweredLeaders.length }/{ overview.mandatoryLeaders.length }</p>
			<p>Har ikke svart: { overview.mandatoryLeaders.length - overview.hasAnsweredLeaders.length }/{ overview.mandatoryLeaders.length }</p>
			<p>Trenger ikke svare: { overview.allLeaders.length - overview.mandatoryLeaders.length }</p>
			-->
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{/if}
	{#if activeSetting === 'allowInnplassering'}
		<AllowInnplassering />
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
	.mailMsg {
		padding: 8px;
		border: 1px solid var(--mork)
	}
	.mailBox {
		display: flex;
		gap: 8px;
		padding: 8px 0;
	}
</style>
