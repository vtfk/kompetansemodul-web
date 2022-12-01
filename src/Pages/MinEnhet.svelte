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
		// console.log(res)

		let unitsData = []

		res.forEach(org => {
			let noReply = 0
			let yes = 0
			let no = 0
			let notMandatory = 0
			let vestfold = 0
			let telemark = 0
			let dunno = 0
			let both = 0
			let noReplyOffice = 0
			let vestfoldToday = 0
			let telemarkToday = 0
			let otherToday = 0

			org.arbeidsforhold.forEach(employee => {
				if(employee.mandatoryCompetenceInput === false) {
					notMandatory++
				} else {
					// SoloRole stats
					if(!employee.soloRole ) noReply++
					if(employee.soloRole === 'Ja' ) yes++
					if(employee.soloRole === 'Nei' ) no++
					
					//OfficelocationToday stats
					if(employee.officeLocation === 'Fylkeshuset i Tønsberg') vestfoldToday++
					if(employee.officeLocation === 'Fylkessenter Seljord' || employee.officeLocation === 'Fylkeshuset T18 Skien' || employee.officeLocation === 'Fylkesbakken Skien' ) telemarkToday++
					if(employee.officeLocation !== 'Fylkeshuset i Tønsberg' && employee.officeLocation !== 'Fylkessenter Seljord' && employee.officeLocation !== 'Fylkeshuset T18 Skien' && employee.officeLocation !== 'Fylkesbakken Skien' ) otherToday++

					//OfficelocationPref stats
					if(!employee.perfCounty ) noReplyOffice++
					if(employee.perfCounty === 'Vet ikke') dunno++
					if(employee.perfCounty === 'Telemark fylkeskommune') telemark++
					if(employee.perfCounty === 'Vestfold fylkeskommune') vestfold++
					if(employee.perfCounty === 'Begge alternativene er like gode for meg') both++
				}
			});
			let stat = {
				unit: org.navn,
				soloRole: {
					noReply: noReply,
					yes: yes,
					no: no,
				},
				officeLocationPref: {
					vestfold: vestfold,
					telemark: telemark,
					dunno: dunno,
					both: both,
					noReply: noReplyOffice,
				},
				officeLocationToday: {
					vestfold: vestfoldToday,
					telemark: telemarkToday,
					other: otherToday
				},
				notMandatory: notMandatory
			}
			unitsData.push(stat)
		})
		const stats = {
			units: unitsData
		}
		// stats = {
		// 	units: unitsData,
		// 	soloRole: {
		// 		noReply: noReply,
		// 		yes: yes,
		// 		no: no,
		// 	},
		// 	officeLocationPref: {
		// 		vestfold: vestfold,
		// 		telemark: telemark,
		// 		dunno: dunno,
		// 		both: both,
		// 		noReply: noReplyOffice,
		// 	},
		// 	officeLocationToday: {
		// 		vestfold: vestfoldToday,
		// 		telemark: telemarkToday,
		// 		other: otherToday
		// 	},
		// 	notMandatory: notMandatory
		// }
		isShowStats = true
		return stats
	}

	const hideStats = () => {
		isShowStats = false
	}
	
	const combineData = (selection, stats) => {
		console.log(stats)
		
		return selection
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
						<div class="centerButton">
							{#if isShowStats === true}
								<Button buttonText="Lukk statistikk" removeSlots={true} size="large" onClick={() => hideStats()}></Button>
							{:else}
								<Button buttonText="Hent statistikk" removeSlots={true} size="large" onClick={() => isShowStats = true}></Button>
							{/if}
						</div>
					</div>
					{#if isShowStats === true}
						{#await getStats(unit.organisasjonsId)}
						<div class="centerSpinner">
							<IconSpinner width="3rem" />
						</div>
						{:then stats}
						{#each stats.units as unitFilter, i}
							{#if unit.navn === unitFilter.unit}
								<div class="toggleFilterContainer">
									<label class="toggleFilter" for={unitFilter.unit}>Ikke inkluder underenheter i statistikk</label><input id={unitFilter.unit} type="checkbox" value={unitFilter.unit} bind:group={selection} >
								</div>
							{/if}
						{/each}
						{#await combineData(selection, stats)}
							<div class="centerSpinner">
								<IconSpinner width="3rem" />
							</div>
						{:then selectionData} 
							<!-- <div class=charts>
								<div class="chartbox">
									<div class="pieChart">
										<Chart 
											datasets={[{
												label: "Antall",
												data: [stats.units[0].soloRole.no, stats.units[0].soloRole.yes, stats.units[0].soloRole.noReply, stats.units[0].notMandatory],
												backgroundColor: [
												colorTelemark,
												colorSame,
												colorNoReply,
												colorNotMandatory
												],
												hoverOffset: 4
											}]}
											labels={[
												`Har ikke kritiske oppgaver (${stats.units[0].soloRole.no})`,
												`Har kritiske oppgaver (${stats.units[0].soloRole.yes})`,
												`Har ikke svart (${stats.units[0].soloRole.noReply})`,
												`Skal ikke svare (${stats.units[0].notMandatory})`
											]}
											title="Svar oversikt kritiske oppgaver" 
											type='pie'
											labelPos="bottom"
											titlePos="top"
										/>
									</div>
								</div>
								<div class="chartbox">
									<div class="stackedBarTop">
										<Chart
											datasets={[
												{
													label: `Vestfold (${stats.units[0].officeLocationPref.vestfold})`,
													barThickness:100,
													data: [stats.units[0].officeLocationPref.vestfold],
													backgroundColor: [
														colorVestfold,
													],
													hoverOffset:4
												},
												{
													label: `Telemark (${stats.units[0].officeLocationPref.telemark})`,
													barThickness:100,
													data: [stats.units[0].officeLocationPref.telemark],
													backgroundColor: [
														colorTelemark
													],
													hoverOffset:4
												},
												{
													label: `Vet ikke (${stats.units[0].officeLocationPref.dunno})`,
													barThickness:100,
													data: [stats.units[0].officeLocationPref.dunno],
													backgroundColor: [
														colorDunno
													],
													hoverOffset:4
												},
												{
													label: `Begge alternativene (${stats.units[0].officeLocationPref.both})`,
													barThickness:100,
													data: [stats.units[0].officeLocationPref.both],
													backgroundColor: [
														colorSame
													],
													hoverOffset:4
												},
												{
													label: `Har ikke svart (${stats.units[0].officeLocationPref.noReply})`,
													barThickness:100,
													data: [stats.units[0].officeLocationPref.noReply],
													backgroundColor: [
														colorNoReply
													],
													hoverOffset:4
												},
												{
													label: `Skal ikke svare (${stats.units[0].notMandatory})`,
													barThickness:100,
													data: [stats.units[0].notMandatory],
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
										/>
									</div>
									<div class="stackedBarBottom">
										<Chart
											datasets={[
												{
													label: `Vestfold (${stats.units[0].officeLocationToday.vestfold})`,
													barThickness:100,
													data: [stats.units[0].officeLocationToday.vestfold],
													backgroundColor: [
														colorVestfold,
													],
													hoverOffset:4
												},
												{
													label: `Telemark (${stats.units[0].officeLocationToday.telemark})`,
													barThickness:100,
													data: [stats.units[0].officeLocationToday.telemark],
													backgroundColor: [
														colorTelemark
													],
													hoverOffset:4
												},
												{
													label: `Annen lokasjon enn et fylkeshus (${stats.units[0].officeLocationToday.other})`,
													barThickness:100,
													data: [stats.units[0].officeLocationToday.other],
													backgroundColor: [
														colorOther
													],
													hoverOffset:4
												},
												{
													label: `Skal ikke svare (${stats.units[0].notMandatory})`,
													barThickness:100,
													data: [stats.units[0].notMandatory],
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
										/>
									</div>
								</div>
							</div> -->
						{/await}
						{/await}
					{/if}
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
