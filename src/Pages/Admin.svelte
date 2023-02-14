<script>
	import { getOrg, getSettings, saveSettings, sendMail, getCriticalTasks }  from '../lib/services/useApi'
    import IconSpinner from '../components/Icons/IconSpinner.svelte';
	import { msalClientStore, criticalTasksStore } from '../lib/services/store'
	import { get } from 'svelte/store'
    import AdminUnit from '../components/AdminUnit.svelte';
    import Button from '../components/Button.svelte';
    import IconCheck from '../components/Icons/IconCheck.svelte';
	import { welcomeMail, remindMail } from '../lib/Helpers/mailTemplates'
	import { structurizeOrg } from '../lib/Helpers/organizationTools'
    import CollapsibleUnit, { createCollapsibleContext } from '../components/CollapsibleUnit.svelte';
	
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

	let criticalTasks = {}
	let employeesInUnit = []

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
			title: "Se hvilke oppgaver lederene har satt som kritiske",
			id: "criticalTasks"
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

	const getcriticalTasks = async () => {
		if (!get(criticalTasksStore)) {
			criticalTasks = await getCriticalTasks()
			criticalTasksStore.set(criticalTasks)
		} else {
			criticalTasks = get(criticalTasksStore)
		}
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

	const getSoloRoles = async (employees) => {
		const result = criticalTasks.filter(ansatt => ansatt.ansattnummer === employees)
		if (result.length > 0) {
			return result
		} else {
			return false
		}
	}

	let arr = []

	const isFalse = (res, index, length, orgId) => {
		// console.log(`Index: ${index+1}`, `Length: ${length}`, `Res: ${res}`, `OrgId: ${orgId}`)
		const obj = {
			orgId: orgId,
			length: length,
			index: index+1
		}
		arr.push(obj)
		return ''
	}

	createCollapsibleContext()
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
	{#if activeSetting === 'criticalTasks'}
	{#await getOrgs()}
		<p>Loading...</p>
	{:then}
		{#each structurizeOrg(filteredOrg)[0].underordnet[1].underordnet as unit}
			{#await getcriticalTasks()}
				<div class="collapsible">
					<h3>Henter kritiske oppgaver</h3>
				</div>
			{:then} 
				<div class="collapsible">
					<CollapsibleUnit open={false}>
						<div slot="head">
							<h3 on:click={() => arr = []}>{unit.navn}</h3>
						</div>
						<div slot="details">
							{#each unit.arbeidsforhold as arbeidsforhold, i}
								{#await getSoloRoles(arbeidsforhold.ansattnummer)}
									<p>Loading...</p>
								{:then res}
									{#if res === false}
										<div>{isFalse(res, i, unit.arbeidsforhold.length, unit.organisasjonsId)}</div>
									{:else}
										<CollapsibleUnit>
											<div slot="head">
												<div class="unitContent">
													<strong on:click={() => arr = []}>{res[0].navn}</strong> - <strong>{`Lokasjon: ${res[0].azureAd.officeLocation}`} </strong> 
													<strong>{`Ønsket Lokasjon: ${res[0].perfCounty}`}</strong>
												</div>
											</div>
											<div slot="details">
												<div class="subUnitContentDesc-level2">
													<p>{res[0].other.soloRoleDescription}</p>
												</div>
											</div>
										</CollapsibleUnit>
									{/if} 
								{/await}
							{/each}
							{#each unit.underordnet as subUnit}
								<CollapsibleUnit>
									<div slot="head">
										<div class="subUnitContent">
											<strong on:click={() => arr = []}>{subUnit.navn}</strong>
										</div>
									</div>
									<div slot="details">
										{#each subUnit.arbeidsforhold as arbeidsforhold, i}	
											{#await getSoloRoles(arbeidsforhold.ansattnummer)}
												<p>Loading...</p>
											{:then res}
												{#if res === false}
													<div>{isFalse(res, i, subUnit.arbeidsforhold.length, subUnit.organisasjonsId)}</div>
												{:else}
													<CollapsibleUnit>
														<div slot="head">
															<div class="subUnitContent-level2">
																<strong on:click={() => arr = []}>{res[0].navn}</strong> - <strong>{`Lokasjon: ${res[0].azureAd.officeLocation}`} </strong> 
																<strong>{`Ønsket Lokasjon: ${res[0].perfCounty}`}</strong>
															</div>
														</div>
														<div slot="details">
															<div class="subUnitContentDesc-level3">
																<p>{res[0].other.soloRoleDescription}</p>
															</div>
														</div>
													</CollapsibleUnit>
												{/if}
											{/await}
										{/each}
										{#each subUnit.underordnet as subUnit1}
											<CollapsibleUnit>
												<div slot="head">
													<div class="subUnitContent-level2">
														<h4 on:click={() => arr = []}>{subUnit1.navn}</h4>
													</div>
												</div>
												<div slot="details">
													<CollapsibleUnit>
														<div slot="head">
															{#each subUnit1.arbeidsforhold as arbeidsforhold, i}
																{#await getSoloRoles(arbeidsforhold.ansattnummer)}
																	<p>Loading...</p>
																{:then res} 
																	{#if res === false}
																		<div>{isFalse(res, i, subUnit1.arbeidsforhold.length, subUnit1.organisasjonsId)}</div>
																	{:else}
																	<CollapsibleUnit>
																		<div slot="head">
																			<div class="subUnitContent-level3">
																				<strong on:click={() => arr = []}>{res[0].navn}</strong> - <strong>{`Lokasjon: ${res[0].azureAd.officeLocation}`} </strong> 
																				<strong>{`Ønsket Lokasjon: ${res[0].perfCounty}`}</strong>
																			</div>
																		</div>
																		<div slot="details">
																			<div class="subUnitContentDesc-level4">
																				<p>{res[0].other.soloRoleDescription}</p>
																			</div>
																		</div>
																	</CollapsibleUnit>
																	{/if} 
																{/await}
															{/each}
														</div>
													</CollapsibleUnit>
												</div>
											</CollapsibleUnit>
										{/each}
									</div>
								</CollapsibleUnit>
							{/each}
						</div>
					</CollapsibleUnit>
				</div>
			{/await}
		{/each}
	{/await}
	{/if}
</div>

<style>



.employee {
        font-weight: 400;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }



	.collapsible {
		cursor: pointer;
		padding: 0.5rem;
		margin: 0.1rem;
		padding-left: 2rem;
		width: 100%;
		border: none;
		text-align: left;
		outline: none;
	}

	.collapsible:nth-child(odd) {
		background-color: var(--sand-2);
	}
	.collapsible:nth-child(even) {
		background-color: var(--sand-1);
	}

	.unitContent {
		width: 46.5vh;
		cursor: pointer;
		margin-left: 1rem;
		padding: 0.5rem;
		border-left: 2px solid var(--mork);
		text-align: left;
		outline: none;
	}

	.subUnitContent {
		width: 47.7vh;
		cursor: pointer;
		padding: 0.5rem;
		margin-left: 2rem;
		border-left: 2px solid var(--mork);
		border-bottom-left-radius: 0.5rem;
		border-bottom: 2px solid var(--mork);
		text-align: left;
		outline: none;
	}

	.subUnitContent-level2 {
		width: 46.3vh;
		cursor: pointer;
		padding: 0.4rem;
		margin-left: 3rem;
		border-left: 2px solid var(--mork);
		border-bottom-left-radius: 0.5rem;
		border-bottom: 2px solid var(--mork);
		text-align: left;
		outline: none;
	}
	.subUnitContent-level3 {
		width: 45vh;
		cursor: pointer;
		padding: 0.3rem;
		margin-left: 4rem;
		border-left: 2px solid var(--mork);
		border-bottom-left-radius: 0.5rem;
		border-bottom: 2px solid var(--mork);
		text-align: left;
		outline: none;
	}

	.subUnitContentDesc-level4 {
		width: 43.7vh;
		cursor: pointer;
		padding: 0.3rem;
		margin-left: 5rem;
		border-left: 2px solid var(--mork);
		border-bottom-left-radius: 0.5rem;
		border-bottom: 2px solid var(--mork);
		border-right: 2px solid var(--mork);
		border-bottom-right-radius: 0.5rem;
		text-align: left;
		outline: none;
	}

	.subUnitNoContent-level3 {
		width: 45vh;
		color: var(--red);
		padding: 0.3rem;
		margin-left: 2rem;
		border-left: 2px solid var(--mork);
		border-bottom-left-radius: 0.5rem;
		border-bottom: 2px solid var(--mork);
		text-align: left;
		outline: none;
	}
	.subUnitNoContent-level2 {
		width: 90%;
		color: var(--red);
		padding: 0.3rem;
		margin-left: 1rem;
		border-left: 2px solid var(--mork);
		border-bottom-left-radius: 0.5rem;
		border-bottom: 2px solid var(--mork);
		text-align: left;
		outline: none;
	}

	.soloRoleDesc {
		width: 40vh;
		padding: 0.4rem;
		margin-left: 3rem;
		border-left: 2px solid var(--mork);
		border-bottom-left-radius: 0.5rem;
		border-bottom: 2px solid var(--mork);
		text-align: left;
		outline: none;
	}

	.chooseAndSave {
		display: flex;
		justify-content: space-between;
	}
	h2 {
		padding-top: 1rem;
		border-bottom: 1px solid var(--mork);
	}
	.content {
		padding-bottom: 2rem;
	}
	.option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.mailMsg {
		padding: 0.5rem;
		border: 1px solid var(--mork)
	}
	.mailBox {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}
</style>
