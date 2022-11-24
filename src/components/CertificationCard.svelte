<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import Button from "./Button.svelte"
    import IconDelete from "./Icons/IconDelete.svelte"
    import IconAdd from "./Icons/IconAdd.svelte"
    import InnerCard from "./InnerCard.svelte"
    import SelectYears from "./SelectYears.svelte"
    import { certificationCardHelp } from "../lib/Helpers/helptexts"
    import { array_move } from '../lib/Helpers/moveArray'

    // Props
    export let title = 'Kurs og Sertifiseringer'
    export let backgroundColor = '--ecruWhite'
    export let competence = {
		certifications: []
	}
    export let canEdit = true
    export let disableInfoBox = false

    if (!competence.certifications) competence.certifications = []

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    let tempCertification = JSON.parse(JSON.stringify(competence.certifications)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    
    let newCertification = {
        year: 2022,
        isActive: true
    }

    // Validation
    let canSave = false
    let validation = []

    // Reactive validation
    $: {
        canSave = true
        const tempValidation = []
        for (const cert of tempCertification) {
            // What fields are we validating
            const valid = {
                name: true,
                yearEnd: true
            }
            // Validation of each field
            if (!cert.name || cert.name.length < 1) {
                valid.name = false
                canSave = false
            }

            if (!cert.yearEnd || cert.yearEnd.length < 1) {
                if(!cert.isActive) {
                    valid.yearEnd = false
                    canSave = false 
                }
            }

            tempValidation.push(valid)
        }
        validation = JSON.parse(JSON.stringify(tempValidation))
    }

    // Functions
    const addCertification = () => {
		// need to assign as a new object to make it "reactive"
		tempCertification = [ ...tempCertification, newCertification ]
		newCertification = {
            year: 2022,
            isActive: true
        }
	}

    const removeCertification = cert => {
		tempCertification = tempCertification.filter(certification => certification !== cert)
	}

    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, certifications: tempCertification})
            competence.certifications = JSON.parse(JSON.stringify(tempCertification))
        }
	}

    const checkIfChanges = () => {
        if ((competence.certifications) !== (tempCertification)) return true
        return false
    }

    const cancelFunc = async () => {
        tempCertification = JSON.parse(JSON.stringify(competence.certifications))
    }

    const moveCert = (old_index, new_index) => {
        tempCertification = array_move(tempCertification, old_index, new_index)
    }
</script>

<Card title={title} disableInfoBox={disableInfoBox} editable={canEdit} backgroundColor={backgroundColor} infoBox={ {content: certificationCardHelp}} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each tempCertification as tempCert, i}
                <InnerCard emoji="📄">
                    <div slot="first">
                        <label for="cert">Velg om det er et Kurs eller en Sertifisering</label><br>
                        <select name="cert" id="cert" bind:value={tempCert.type}>
                            <option value="Kurs">Kurs</option>
                            <option value="Sertifisering">Sertifisering</option>
                        </select>
                        {#if tempCert.type === 'Kurs'}
                            <label for="navn">Navn på Kurs</label>
                        {:else}
                            <label for="navn">Navn på Sertifisering</label>
                        {/if}
                        <label for="navn" class="validation">{!validation[i].name ? '*' : '' }</label>
                        <input class="{!validation[i].name ? 'required' : '' }" type="text" id="navn" bind:value={tempCert.name}>
                        <label for="year">Når ble det gjennomført</label><br>
                        <SelectYears startYear={1950} bind:yearValue={tempCert.year}></SelectYears>
                        <div class="checkboxContainer">
                            <input type="checkbox" id="active" bind:checked={tempCert.isActive} />
                            <label for="active">Ingen Utløpsdato</label>
                        </div>
                        {#if !tempCert.isActive }
                            <div>
                                <label for="year">Utløpsdato</label><label for="to" class='validation'>{!validation[i].yearEnd ? '*' : '' }</label><br>
                                {#if tempCert.year}
                                    <SelectYears startYear={tempCert.year} expandYear={20} bind:yearValue={tempCert.yearEnd} validation={true} validated={validation[i].yearEnd}/>
                                {/if}
                            </div>
                        {:else}
                            {tempCert.yearEnd = ''}
                        {/if}
                    </div>
                    <div slot="right">
                        <Button buttonText="Fjern" onClick={() => removeCertification(tempCert)}><IconDelete slot="before" /></Button>
                        <!-- <div class="buttonContainer">
                            <div class="upDownButton">
                                <Button onlyIcon={true} title="Flytt Opp" removeSlots={true} buttonText="⬆" disabled={i === 0} onClick={() => moveCert(i, (i-1))}></Button>
                            </div>
                            <div class="upDownButton">
                                <Button onlyIcon={true} title="Flytt Ned" removeSlots={true} buttonText="⬇" disabled={i === tempCertification.length-1} onClick={() => moveCert(i, (i+1))}></Button>
                            </div>
                        </div> -->
                    </div>
                </InnerCard>
            {/each}
            <Button buttonText="Legg til" onClick={() => addCertification()}><IconAdd slot="before" /></Button>
        {:else if competence.certifications.length === 0}
            <div><em>Ingen Kurs eller Sertifiseringer lagt inn</em></div> 
        {:else}
            {#each competence.certifications as cert}
                <InnerCard emoji="📄">
                    <div slot="first">
                        <h3>{cert.name || 'Ukjent navn'}</h3>
                        <h4>{cert.type || 'Ukjent type'}</h4>
                        <label for="year">📅 {(cert.year && cert.yearEnd) ? `${cert.year} - ${cert.yearEnd}` : `${cert.year} - Ingen utløpsdato`}</label>
                    </div>
                </InnerCard>
            {/each} 
        {/if}
    </div>
</Card>
<style>
.buttonContainer {
       display: flex;
}
.upDownButton {
    padding-top: 0.5rem;
    padding-left: 0.5rem;
}

@media(max-width: 885px) {
        .upDownButton {
            padding-left: 0.5rem;
            padding-top: 0rem;
        }
    }

</style>