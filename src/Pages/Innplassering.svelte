<script>
    import Card from "../components/Card.svelte"
		import { get } from 'svelte/store'
		import { msalClientStore }  from '../lib/services/store'
		import { getPerson } from '../lib/services/useApi'
		import IconSpinner from '../components/Icons/IconSpinner.svelte'
		import Button from "../components/Button.svelte"
    import InnerCard from "../components/InnerCard.svelte"

		const msalClient = get(msalClientStore)
		const accounts = msalClient.getAllAccounts()
		const currentUser = accounts[0].name
		const currentUpn = accounts[0].username

		// State
		let innplasseringsdata = {}
		let employees = []
		let innplasseringssamtaler = []
	 	let canInnplassere = false
		let myInnplasseringer = []
		let limitEmployees = 30
    let showEmployees = []

		let searchValue = ""

		const getInnplasseringsStatus = (emp) => {
			const innplassering = innplasseringssamtaler.find(samtale => samtale.employeeNumber === emp.ansattnummer)
			if (innplassering) {
				return {
					status: `✅ Samtale gjennomført`,
					responsible: `${innplassering.responsibleName}`,
					full: `✅ Samtale gjennomført den ${innplassering.timestamp}, med ${innplassering.responsibleName}`,
					title: `✅ Samtale gjennomført den ${innplassering.timestamp}, med ${innplassering.responsibleName}`
				}
			} else {
				return {
					status: `❌ Samtale ikke gjennomført`,
					responsible: ``,
					full: `❌ Samtale ikke gjennomført enda`,
					title: `❌ Samtale ikke gjennomført enda`
				}
			}
		}

		const getInnplasseringsData = async () => {
			const res = await getPerson('innplassering')
			innplasseringsdata = res.innplasseringsdata
			employees = res.employees ?? []
			innplasseringssamtaler = res.innplasseringssamtaler
			canInnplassere = res.canInnplassere
			myInnplasseringer = innplasseringssamtaler ? innplasseringssamtaler.filter(samtale => samtale.responsibleUpn === currentUpn).sort((a, b) => (new Date(a.timestamp) > new Date(b.timestamp)) ? 1 : -1) : []
			showEmployees = employees.sort((a, b) => (a.navn > b.navn) ? 1 : -1).slice(0, limitEmployees)

			return true
		}

		$: {
        showEmployees = showEmployees.sort((a, b) => (a.navn > b.navn) ? 1 : -1)
    }
    $: {
        if (true) {
            showEmployees = employees.filter(emp => (emp.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling) && emp.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling).arbeidssted.kortnavn.toLowerCase().startsWith(searchValue.toLowerCase())) || (emp.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling) && emp.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling).arbeidssted.navn.toLowerCase().startsWith(searchValue.toLowerCase())) || (emp.navn.toLowerCase().startsWith(searchValue.toLowerCase())) || (emp.fornavn.toLowerCase().startsWith(searchValue.toLowerCase())) || (emp.etternavn.toLowerCase().startsWith(searchValue.toLowerCase()))).slice(0, limitEmployees)
        }
    }

</script>

<div class="content">
	{#await getInnplasseringsData()}
		<IconSpinner />
	{:then res}
		<Card title="Din innplasseringsstatus" backgroundColor="--catSkillWhite">
			<p>Hei, {currentUser}!</p>
			{#if innplasseringsdata}
				<p>Du hadde innplasseringssamtale den: {innplasseringsdata.timestamp}. Ansvarlig for samtalen var {innplasseringsdata.responsibleName}.</p>
				<br>
				<p><strong>Nytt fylke: </strong>{innplasseringsdata.newCounty}</p>
				<p><strong>Ny enhet: </strong>{innplasseringsdata.newUnit}</p>
			{:else}
				<p>Du har ikke hatt innplasseringssamtale enda.</p>
			{/if}
		</Card>

		{#if canInnplassere}
			<Card title="Dine gjennomførte samtaler ✔" backgroundColor="--korn-2">
				<div>
					<p><em>Det kan ta opptil en time før gjennomførte samtaler dukker opp her</em></p>
					{#if myInnplasseringer.length > 0}
						{#each myInnplasseringer as ip}
							<p>{ip.employeeName} - {ip.timestamp} - {ip.newUnit} - {ip.newCounty}</p>
						{/each}
					{:else}
						<p><em>Du har ikke gjennomført noen samtaler enda</em></p>
					{/if}
				</div>
			</Card>
		{/if}

		<Card title="Opprett innplasseringssamtale">
			{#if !canInnplassere}
				<p>Du har ikke tilgang til å opprette innplasseringssamtaler. Om du mener dette er feil, ta kontakt med HR.</p>
			{:else}
				<div class="section">
					<label for="navnesok">Søk etter ansatt her</label>
					<input id="navnesok" type="text" bind:value={searchValue} placeholder="Skriv inn navn på ansatt eller enhet her" />
					<div class="tableContainer">
							{#if showEmployees.length === 0}
									<p><em>Det er da ingen ansatte hos oss som heter {searchValue}</em></p>
							{/if}
							{#each showEmployees as emp}
									<InnerCard size="small" emoji={`${emp.fornavn.substring(0,1)}${emp.etternavn.substring(0,1)}`}>
										<div slot="first">
											<h4>{emp.navn}</h4>
											<p><em>{(emp.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling))?.stillingstittel ?? 'Ansatt'}</em></p>
											<p>{(emp.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling))?.arbeidssted.navn ?? 'Ukjent enhet'}</p>
											<p>{(emp.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling))?.arbeidssted.kortnavn ?? 'Ukjent enhet'}</p>
										</div>
										<div slot="second">
											<p title={getInnplasseringsStatus(emp).title}>{getInnplasseringsStatus(emp).status}</p>
											<a class="link" href="https://internskjema.vtfk.no/skjema/VTFK0242/Innplasseringssamtale?employeeUpn={emp.userPrincipalName}" target="_blank">Opprett innplasseringssamtale</a>
										</div>
									</InnerCard>
							{/each}
					</div>
					<div class="navigation">
							{#if showEmployees.length === limitEmployees}
									<div style="display: flex; gap: 16px;">
											<div class="link" on:click={() => { limitEmployees += 30; showEmployees = employees.slice(0, limitEmployees) }}>Vis flere (+30)</div>
											<div class="link" on:click={() => { if (limitEmployees > 30) {limitEmployees -= 30}; showEmployees = employees.slice(0, limitEmployees) }}>Vis færre (-30)</div>
									</div>
							{/if}
					</div>
				</div>
			{/if}
		</Card>
	{:catch error}
		<p>{error}</p>
	{/await}
</div>

<style>
</style>
