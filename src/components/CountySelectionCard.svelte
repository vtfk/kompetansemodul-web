<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia, mandatoryCompetence } from '../lib/services/store'
    import { countySelectionCardHelp } from '../lib/Helpers/helptexts'

    // Props
    export let title = 'Ønsket fylkeskommune / arbeidssted etter oppdeling'
    export let backgroundColor = '--ecruWhite'
    export let competence = {
		perfCounty: null
	}

    if (!competence.perfCounty) competence.perfCounty = null

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // State
    let tempPerfCounty = JSON.parse(JSON.stringify(competence.perfCounty)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit

    // Functions

    const validateMandatoryData = () => {
        // Store card validation
        const mandatoryData = get(mandatoryCompetence)
        mandatoryData.perfCounty = competence.perfCounty ? 'set' : 'no input'
        mandatoryCompetence.set(mandatoryData)
    }

    // Run if needed
    if (get(mandatoryCompetence).perfCounty === 'not checked') {
        validateMandatoryData()
    }



    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, perfCounty: tempPerfCounty})
            competence.perfCounty = JSON.parse(JSON.stringify(tempPerfCounty))
            validateMandatoryData()
        } 
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.perfCounty) !== JSON.stringify(tempPerfCounty)) return true
        return false
    }

    const cancelFunc = async () => {
        tempPerfCounty = JSON.parse(JSON.stringify(competence.perfCounty))
    }

</script>

<Card title={title} saveFunc={saveFunc} cancelFunc={cancelFunc} backgroundColor={backgroundColor} editable={true} infoBox={ {content: countySelectionCardHelp} } canSave={true} >
    {#if editInfo.isEditing && editInfo.editBlock === title}
        <div class="contentContainer">
            <div>
                <!-- <label>Velg ønsket fylkeskommune/arbeidssted etter oppdeling</label> -->
                <select name="preferredCounty" id="preferredCounty" bind:value={tempPerfCounty}>
                    <option value="Vet ikke">Vet ikke</option>
                    <option value="Telemark fylkeskommune">Telemark fylkeskommune</option>
                    <option value="Vestfold fylkeskommune">Vestfold fylkeskommune</option>
                    <option value="Begge alternativene er like gode for meg">Begge alternativene er like gode for meg</option>
                </select>
            </div>
        </div>
    {:else}
        <div class="contentContainer">
            <div>
                <!-- <label>Valgt ønsket fylkeskommune/arbeidssted etter oppdeling</label> -->
                {#if !competence.perfCounty || competence.perfCounty.length === 0}
                    <div><em>Ikke fylt ut av ansatt</em></div>
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
