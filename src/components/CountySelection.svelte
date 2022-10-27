<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'

    // Props
    export let title = 'Ønsket fylkeskommune/arbeidssted etter oppdeling'
    export let backgroundColor = '--ecruWhite'
    export let competence = {
		perfCounty: []
	}

    if (!competence.perfCounty) competence.perfCounty = []

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // State
    let tempPerfCounty = JSON.parse(JSON.stringify(competence.perfCounty)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    
    // Validation
    let canSave = false

    // Functions
    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, perfCounty: tempPerfCounty})
            competence.perfCounty = JSON.parse(JSON.stringify(tempPerfCounty))
        } else {
            console.log('Ingen endring, gidder ikke lagre')
        }
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.perfCounty) !== JSON.stringify(tempPerfCounty)) return true
        return false
    }

    const cancelFunc = async () => {
        tempPerfCounty = JSON.parse(JSON.stringify(competence.perfCounty))
    }

    const infoText = "<p>Vi ber også om at du tar stilling til foretrukken fylkeskommune. Her ønsker vi at du svarer på hvilken fylkeskommune du foretrekker (Telemark eller Vestfold). Du kan også trykke “vet ikke” om du ikke har bestemt deg eller om ønsket ditt er avhengig av andre rammebetingelser.</p><br><p><b>MERK</b>: Ditt svar er ikke bindende og er kun ment for at arbeidsgiver skal få en oversikt over hva de ansatte ønsker. Det betyr at ditt svar ikke automatisk vil få følger for innplasseringen. </p>"
</script>

<Card title={title} saveFunc={saveFunc} cancelFunc={cancelFunc} backgroundColor={backgroundColor} editable={true} infoBox={ {content: infoText} } canSave={true} >
    {#if editInfo.isEditing && editInfo.editBlock === title}
        <div class="contentContainer">
            <div>
                <!-- <label>Velg ønsket fylkeskommune/arbeidssted etter oppdeling</label> -->
                <select name="preferredCounty" id="preferredCounty" bind:value={tempPerfCounty}>
                    <option value="Vet ikke">Vet ikke</option>
                    <option value="Telemark fylkeskommune">Telemark fylkeskommune</option>
                    <option value="Vestfold fylkeskommune">Vestfold fylkeskommune</option>
                    <option value="Samma for meg hvor jeg havner(hr - gi oss innspill)">Samma for meg hvor jeg havner(hr - gi oss innspill)</option> <!-- // TODO: Hent innspill fra HR -->
                </select>
            </div>
        </div>
    {:else}
        <div class="contentContainer">
            <div>
                <!-- <label>Valgt ønsket fylkeskommune/arbeidssted etter oppdeling</label> -->
                {#if competence.perfCounty.length === 0}
                    Ikke fylt ut av ansatt
                {:else}
                    {competence.perfCounty}
                {/if}
            </div>
        </div>
    {/if}
</Card>

<style>
    .contentContainer {
        display: flex;
        flex-wrap: wrap;
        max-width: 50rem;
        justify-content: space-between;
    }
    /* label {
        font-size: 0.9em;
        font-weight: bold;
        font-style: italic;
    } */
</style>
