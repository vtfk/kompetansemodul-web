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

	const colorVestfold = '#7ABED3'
	const colorTelemark = '#AD879E'
	const colorVetIkke = '#EB8380'
	const colorSame = '#90BC7F'

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

	const getValuesForChart = (unit) => {
		let noReply = 0
		let yes = 0
		let no = 0
		let soloDesc = {
			name: '',
			desc: ''
		}
		unit.arbeidsforhold.forEach(employee => {
			if(!employee.soloRole) noReply++
			if(employee.soloRole === 'Ja') {
				yes++
				soloDesc.name = employee.navn
				soloDesc.desc = employee.systemId
			}
			if(employee.soloRole === 'Nei') no++ 
		})
		const replies = {
			noReply: noReply,
			yes: yes,
			no: no,
			soloDesc: {
				name: soloDesc.name,
				desc: soloDesc.desc
			}
		}
		return replies
	}

	const getStats = () => {
		isShowStats = true
	}

	const hideStats = () => {
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
						<div class="centerButton">
							{#if isShowStats === true}
								<div class="buttonStyle">
									<Button buttonText="Hent statistikk" removeSlots={true} size="large" onClick={() => getStats()}></Button>
								</div>
								<div class="buttonStyle">
									<Button buttonText="Lukk statistikk" removeSlots={true} size="large" onClick={() => hideStats()}></Button>
								</div>
							{:else}
								<Button buttonText="Hent statistikk" removeSlots={true} size="large" onClick={() => getStats()}></Button>
							{/if}
						</div>
					</div>
					{#if isShowStats === true}
						{#await getValuesForChart(unit)}
						<p><IconSpinner width="2rem" /></p>
						{:then replies}
							<div class=charts>
								<div class="chartbox">
									<div class="pieChart">
										<Chart 
											datasets={[{
												label: "Antall",
												data: [replies.no, replies.yes, replies.noReply],
												backgroundColor: [
												colorTelemark,
												colorSame,
												colorVetIkke,
												],
												hoverOffset: 4
											}]}
											labels={[
												`Har ikke kritiske oppgaver (${replies.no})`,
												`Har kritiske oppgaver (${replies.yes})`,
												`Har ikke svart (${replies.noReply})`
											]}
											title="Svar oversikt kritiske oppgaver" 
											type='pie'
											labelPos="bottom"
											titlePos="top"
										/>
									</div>
									<!-- <div>
										<label for="critical">Kritiske oppgaver</label>
										<dl style="text-indent: 1em;">
											<dt>Nils</dt>
											<dd style="text-indent: 2em;">- En kritisk oppgave</dd>
											<dt>Geir</dt>
											<dd style="text-indent: 2em;">- En kritisk oppgave</dd>
											<dd style="text-indent: 2em;">- To kritisk oppgaver</dd>
										</dl>
									</div> -->
								</div>
								<div class="chartbox">
									<div class="stackedBarTop">
										<Chart
											datasets={[
												{
													label: "Vestfold",
													data: [3],
													backgroundColor: [
													colorVestfold,
													],
													hoverOffset:4
												},
												{
													label: "Telemark",
													data: [1],
													backgroundColor: [
													colorTelemark
													],
													hoverOffset:4
												},
												{
													label: "Vet ikke",
													data: [1],
													backgroundColor: [
													colorVetIkke
													],
													hoverOffset:4
												},
												{
													label: "Begge er like gode",
													data: [0],
													backgroundColor: [
													colorSame
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
													label: "Vestfold",
													data: [3],
													backgroundColor: [
													colorVestfold,
													],
													hoverOffset:4
												},
												{
													label: "Telemark",
													data: [2],
													backgroundColor: [
													colorTelemark
													],
													hoverOffset:4
												},
												// {
												// 	label: "Vet ikke",
												// 	data: [1],
												// 	backgroundColor: [
												// 	'#EB8380'
												// 	],
												// 	hoverOffset:4
												// },
												// {
												// 	label: "Begge er like gode",
												// 	data: [0],
												// 	backgroundColor: [
												// 	'#FFFFFF'
												// 	],
												// 	hoverOffset:4
												// }
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
							</div>
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
	.buttonStyle {
		padding: 1rem;
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
		margin-top: -18rem;
	}

	.stackedBarTop {
		padding-top: 2rem;
	}

</style>
