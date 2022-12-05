<script>
	import { getOrg }  from '../lib/services/useApi'
	import { changePage }  from '../lib/Helpers/changePage'
	import IconSpinner from '../components/Icons/IconSpinner.svelte';
    import EmployeeBox from '../components/EmployeeBox.svelte';
	import { msalClientStore, unitParameter } from '../lib/services/store'
	import { get } from 'svelte/store'
  	import Chart from '../components/Chart.svelte';
  	import Button from '../components/Button.svelte';

	// State
	let activeUnit
	let chosenUnit
	let expandedView = false
	let isShowStats = false
	let toggleValue = false
	let group = 1
	let selection = []
	let filteredStatsAllUnits = []
	let filteredList = []
	let allStats = []
	
	// Colors
	const colorVestfold = '#7ABED3'
	const colorTelemark = '#AD879E'
	const colorNoReply = '#EB8380'
	const colorSame = '#90BC7F'
	const colorNotMandatory = '#E3E3E3'
	const colorDunno = '#F0E1BD'
	const colorOther = '#D1AB94'

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
		return res
	}

	const isUnitLeader = (leaderUpn) => {
		const msalClient = get(msalClientStore)
		const accounts = msalClient.getAllAccounts()
		if (leaderUpn === accounts[0].username) return true
		return false
	}

	// Checks if leader also has employement in the same unit, or is only leader
	const getLeaderEmployeeData = (unit) => {
		const employment = unit.arbeidsforhold.find(forhold => forhold.userPrincipalName === unit.leder.userPrincipalName)
		if (employment) return employment
		else return {
			...unit.leder,
			stillingstittel: 'Leder',
			leaderWithoutRelation: true,
			tasks: ['Leder']
		}
	}
	
	const getStats = async (orgId) => {
		const res = await getOrg(`report-${orgId}`)
		allStats = res
		filteredStatsAllUnits = JSON.parse(JSON.stringify(allStats))
		filteredList.push(filteredStatsAllUnits.find(org => orgId === org.organisasjonsId))
		
		return true
	}

	const generateStats = (units, isChecked) => {
		const stats = {
			soloRoleStats: {
				soloRoleNoReply: 0,
				soloRoleYes: 0,
				soloRoleNo: 0,
			},
			perfCountyStats: {
				perfVestfold: 0,
				perfTelemark: 0,
				perfDunno: 0,
				perfBoth: 0,
				perfNoReply: 0,
			},
			currentCountyStats: {
				officeVestfold: 0,
				officeTelemark:0,
				officeOther: 0
			},
			notMandatory: 0,
		}

		if(isChecked === true) {
			filteredList.forEach(org => {
				org.arbeidsforhold.forEach(employee => {
					if(employee.mandatoryCompetenceInput === false) {
						stats.notMandatory++
					} else {
						// SoloRole stats
						if(!employee.soloRole ) stats.soloRoleStats.soloRoleNoReply++
						if(employee.soloRole === 'Ja' ) stats.soloRoleStats.soloRoleYes++
						if(employee.soloRole === 'Nei' ) stats.soloRoleStats.soloRoleNo++
						
						//OfficelocationToday stats
						if(employee.officeLocation === 'Fylkeshuset i Tønsberg') stats.currentCountyStats.officeVestfold++
						if(employee.officeLocation === 'Fylkessenter Seljord' || employee.officeLocation === 'Fylkeshuset T18 Skien' || employee.officeLocation === 'Fylkesbakken Skien' ) stats.currentCountyStats.officeTelemark++
						if(employee.officeLocation !== 'Fylkeshuset i Tønsberg' && employee.officeLocation !== 'Fylkessenter Seljord' && employee.officeLocation !== 'Fylkeshuset T18 Skien' && employee.officeLocation !== 'Fylkesbakken Skien' ) stats.currentCountyStats.officeOther++

						//OfficelocationPref stats
						if(!employee.perfCounty ) stats.perfCountyStats.perfNoReply++
						if(employee.perfCounty === 'Vet ikke') stats.perfCountyStats.perfDunno++
						if(employee.perfCounty === 'Telemark fylkeskommune') stats.perfCountyStats.perfTelemark++
						if(employee.perfCounty === 'Vestfold fylkeskommune') stats.perfCountyStats.perfVestfold++
						if(employee.perfCounty === 'Begge alternativene er like gode for meg') stats.perfCountyStats.perfBoth++
					}
				})
			})
		} 
		if(isChecked === false) {
			filteredStatsAllUnits.forEach(org => {
				org.arbeidsforhold.forEach(employee => {
					if(employee.mandatoryCompetenceInput === false) {
						stats.notMandatory++
					} else {
						// SoloRole stats
						if(!employee.soloRole ) stats.soloRoleStats.soloRoleNoReply++
						if(employee.soloRole === 'Ja' ) stats.soloRoleStats.soloRoleYes++
						if(employee.soloRole === 'Nei' ) stats.soloRoleStats.soloRoleNo++
						
						//OfficelocationToday stats
						if(employee.officeLocation === 'Fylkeshuset i Tønsberg') stats.currentCountyStats.officeVestfold++
						if(employee.officeLocation === 'Fylkessenter Seljord' || employee.officeLocation === 'Fylkeshuset T18 Skien' || employee.officeLocation === 'Fylkesbakken Skien' ) stats.currentCountyStats.officeTelemark++
						if(employee.officeLocation !== 'Fylkeshuset i Tønsberg' && employee.officeLocation !== 'Fylkessenter Seljord' && employee.officeLocation !== 'Fylkeshuset T18 Skien' && employee.officeLocation !== 'Fylkesbakken Skien' ) stats.currentCountyStats.officeOther++

						//OfficelocationPref stats
						if(!employee.perfCounty ) stats.perfCountyStats.perfNoReply++
						if(employee.perfCounty === 'Vet ikke') stats.perfCountyStats.perfDunno++
						if(employee.perfCounty === 'Telemark fylkeskommune') stats.perfCountyStats.perfTelemark++
						if(employee.perfCounty === 'Vestfold fylkeskommune') stats.perfCountyStats.perfVestfold++
						if(employee.perfCounty === 'Begge alternativene er like gode for meg') stats.perfCountyStats.perfBoth++
					}
				})
			})
		}
		
		const results = {
			soloRoleData: {
				no: stats.soloRoleStats.soloRoleNo, 
				yes: stats.soloRoleStats.soloRoleYes, 
				noReply: stats.soloRoleStats.soloRoleNoReply, 
				notMandatory: stats.notMandatory,
			},
			perfCountyData: {
				vestfold: stats.perfCountyStats.perfVestfold,
				telemark: stats.perfCountyStats.perfTelemark,
				dunno: stats.perfCountyStats.perfDunno,
				both: stats.perfCountyStats.perfBoth,
				noReply: stats.perfCountyStats.perfNoReply
			},
			currentCountyData: {
				vestfold: stats.currentCountyStats.officeVestfold,
				telemark: stats.currentCountyStats.officeTelemark,
				other: stats.currentCountyStats.officeOther,
			},
			notMandatory: stats.notMandatory
		}
		isShowStats = true
		return results
	}

	const hideStats = () => {
		toggleValue = false
		isShowStats = false
	}
	
</script>

<div class="content">
	{#await getMyOrgUnit(activeUnit)}
		<p><IconSpinner width="2rem" /></p>
	{:then units}
		{#if units.length > 1 && !chosenUnit}
			<h3>Du er tilknyttet flere enheter, vennligst velg den du ønsker å se</h3>
			{#each units as unit}
				<p class="link" on:click={() => {changePage('minenhet', { setUnit: unit.organisasjonsId })}}>
					{unit.navn}<strong>{isUnitLeader(unit.leder.userPrincipalName) ? ' (Leder)' : ''}</strong>
				</p>
			{/each}
		{:else}
			{#each units as unit}
				{#if unit.overordnet && unit.overordnet.organisasjonsId !== unit.organisasjonsId}
					<p class="link center" on:click={() => {changePage('minenhet', { setUnit: unit.overordnet.organisasjonsId })}}>{unit.overordnet.navn}</p>
				{/if}
				<h2 class="unitHeader center">{unit.navn}</h2>
				{#if unit.underordnet.length > 0}
					<h3 class="center">Underenheter</h3>
					<div class="center childrenContainer">
						{#each unit.underordnet as kid}
							<p class="link center" on:click={() => {changePage('minenhet', { setUnit: kid.organisasjonsId })}}>{kid.navn}</p>
						{/each}
					</div>
				{/if}
				{#if unit.isPrivileged}
					<div>
						<div class="unitHeader flexMe">
							<h3>Statistikk</h3>
						</div>
					</div>
					{#await getStats(unit.organisasjonsId)}
						<div class="centerButton">
							<Button onlyIcon={true} size="large" buttonText="Laster... "><IconSpinner slot="after"  width="2rem"/></Button>
						</div>
					{:then}
						<div class="centerButton">
							{#if isShowStats === true}
								<Button buttonText="Lukk statistikk" removeSlots={true} size="large" onClick={() => hideStats()}></Button>
							{:else}
								<Button buttonText="Hent statistikk" removeSlots={true} size="large" onClick={() => isShowStats = true}></Button>
							{/if}
						</div>
						{#if isShowStats === true}
							{#if unit.underordnet.length > 1 }
								<div class="toggleFilterContainer">
									<label class="toggleFilter" for={unit}>Ikke inkluder underenheter i statistikk</label><input id={unit} type="checkbox" on:click={() => toggleValue = !toggleValue} >
								</div>
							{/if}
							{#await generateStats(unit.organisasjonsId, toggleValue)}
								<div class="centerSpinner">
									<IconSpinner width="3rem" />
								</div>
							{:then data}
							<!-- {console.log([data.soloRoleData.no, data.soloRoleData.yes, data.soloRoleData.noReply, data.soloRoleData.notMandatory])} -->
								<div class=charts>
									<div class="chartbox">
										<div class="pieChart">
											<Chart 
												datasets={[{
													label: "Antall",
													data: [data.soloRoleData.no, data.soloRoleData.yes, data.soloRoleData.noReply, data.soloRoleData.notMandatory],
													backgroundColor: [
													colorTelemark,
													colorSame,
													colorNoReply,
													colorNotMandatory
													],
													hoverOffset: 4
												}]}
												labels={[
													`Har ikke kritiske oppgaver (${data.soloRoleData.no})`,
													`Har kritiske oppgaver (${data.soloRoleData.yes})`,
													`Har ikke svart (${data.soloRoleData.noReply})`,
													`Skal ikke svare (${data.soloRoleData.notMandatory})`
												]}
												title='Kritiske oppgaver'
												type='pie'
												labelPos="bottom"
												titlePos="top"
												dataChange={toggleValue}
											/>
										</div>
									</div>
									<div class="chartbox">
										<div class="stackedBarTop">
											<Chart
												datasets={[
													{
														label: `Vestfold (${data.perfCountyData.vestfold})`,
														barThickness:100,
														data: [data.perfCountyData.vestfold],
														backgroundColor: [
															colorVestfold,
														],
														hoverOffset:4
													},
													{
														label: `Telemark (${data.perfCountyData.telemark})`,
														barThickness:100,
														data: [data.perfCountyData.telemark],
														backgroundColor: [
															colorTelemark
														],
														hoverOffset:4
													},
													{
														label: `Vet ikke (${data.perfCountyData.dunno})`,
														barThickness:100,
														data: [data.perfCountyData.dunno],
														backgroundColor: [
															colorDunno
														],
														hoverOffset:4
													},
													{
														label: `Begge alternativene (${data.perfCountyData.both})`,
														barThickness:100,
														data: [data.perfCountyData.both],
														backgroundColor: [
															colorSame
														],
														hoverOffset:4
													},
													{
														label: `Har ikke svart (${data.perfCountyData.noReply})`,
														barThickness:100,
														data: [data.perfCountyData.noReply],
														backgroundColor: [
															colorNoReply
														],
														hoverOffset:4
													},
													{
														label: `Skal ikke svare (${data.notMandatory})`,
														barThickness:100,
														data: [data.notMandatory],
														backgroundColor: [
															colorNotMandatory
														],
														hoverOffset:4
													}
												]}
												labels={[
													''
												]}
												title="Ønsket arbeidsted"
												type="stackedBar"
												labelPos="top"
												titlePos="top"
												dataChange={toggleValue}
											/>
										</div>
										<div class="stackedBarBottom">
											<Chart
												datasets={[
													{
														label: `Vestfold (${data.currentCountyData.vestfold})`,
														barThickness:100,
														data: [data.currentCountyData.vestfold],
														backgroundColor: [
															colorVestfold,
														],
														hoverOffset:4
													},
													{
														label: `Telemark (${data.currentCountyData.telemark})`,
														barThickness:100,
														data: [data.currentCountyData.telemark],
														backgroundColor: [
															colorTelemark
														],
														hoverOffset:4
													},
													{
														label: `Annen lokasjon enn et fylkeshus (${data.currentCountyData.other})`,
														barThickness:100,
														data: [data.currentCountyData.other],
														backgroundColor: [
															colorOther
														],
														hoverOffset:4
													},
													{
														label: `Skal ikke svare (${data.notMandatory})`,
														barThickness:100,
														data: [data.notMandatory],
														backgroundColor: [
															colorNotMandatory
														],
														hoverOffset:4
													},
												]}
												labels={[
													''
												]}
												title="Dagens arbeidsted"
												type="stackedBar"
												labelPos="bottom"
												titlePos="bottom"
												dataChange={toggleValue}
											/>
										</div>
									</div>
								</div>
							{:catch error} 
								<p>{error}</p>
							{/await}
						{/if}
					{:catch error}
						<p>{error}</p>
					{/await}
				{/if}
				{#if unit.arbeidsforhold.length > 0 || unit.leder.userPrincipalName}
					<div class="unitHeader flexMe">
						<h3>Ansatte</h3>
						<div class="toggleView"><div class="toggleContainer"><label for="toggle">Utvidet visning</label><input id="toggle" type="checkbox" bind:checked={expandedView} /></div></div>
					</div>
					<div class="employeeContainer">
						<EmployeeBox expandedView={expandedView} onClick={() => changePage('person', { setPerson: unit.leder.ansattnummer, setPrevious: { activeUnit, name: unit.navn } } )} employeeData={{ ...getLeaderEmployeeData(unit), isPrivileged: unit.isPrivileged, department: unit.navn}} />
						{#each unit.arbeidsforhold.filter(employee => employee.userPrincipalName !== unit.leder.userPrincipalName) as emp, i}
							<EmployeeBox expandedView={expandedView} onClick={() => changePage('person', { setPerson: emp.userPrincipalName, setPrevious: { activeUnit, name: unit.navn } })} employeeData={{...emp, department: unit.navn, isPrivileged: unit.isPrivileged}} />
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
	.centerButton {
		display: flex;
		justify-content: center;
	}
	.toggleContainer {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.toggleView {
		position: absolute;
		right: 0px;
	}

	.charts {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.chartbox {
		padding-top: 2rem;
	}

	.pieChart {
		margin-bottom: 15rem;
		margin-top: 2rem
	}

	.stackedBarBottom {
		margin-top: -17rem;
	}

	.stackedBarTop {
		padding-top: 2rem;
	}

	.toggleFilterContainer {
		display:flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: center;
		padding-top: 1rem;
	}

	.toggleFilter {
		display: flex;
		padding-right:0.5rem;
	}

	@media(max-width: 1183px) { 
		.stackedBarTop {
			padding-top: 12rem;
		}
		.charts {
			justify-content: space-around;
		}
	}
</style>
