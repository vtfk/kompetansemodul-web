<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import Button from "./Button.svelte"
    import IconDelete from "./Icons/IconDelete.svelte"
    import IconAdd from "./Icons/IconAdd.svelte"
    import InnerCard from "./InnerCard.svelte"
    import SelectYears from "./SelectYears.svelte";

    // Props
    export let title = 'Kurs og Sertifiseringer'
    export let backgroundColor = '--potPourri'
    export let competence = {
		certifications: []
	}

    if (!competence.certifications) competence.certifications = []

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    let tempCertification = JSON.parse(JSON.stringify(competence.certifications)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    
    let newCertification = {
        year: 2022
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
            }
            // Validation of each field
            if (!cert.name || cert.name.length < 1) {
                valid.name = false
                canSave = false
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
            year: 2022
        }
	}

    const removeCertification = cert => {
		tempCertification = tempCertification.filter(certification => certification !== cert)
	}

    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, certifications: tempCertification})
            competence.certifications = JSON.parse(JSON.stringify(tempCertification))
        } else {
            console.log('Ingen endring, gidder ikke lagre')
        }
	}

    const checkIfChanges = () => {
        if ((competence.certifications) !== (tempCertification)) return true
        return false
    }

    const cancelFunc = async () => {
        tempCertification = JSON.parse(JSON.stringify(competence.certifications))
    }
</script>

<Card title={title} editable={true} backgroundColor={backgroundColor} infoBox={ {content: 'noe tekst her da'}} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
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
                        <input type="text" id="navn" bind:value={tempCert.name}>
                        <label for="year">Når ble det gjennomført</label><br>
                        <SelectYears startYear={1950} bind:yearValue={tempCert.year}></SelectYears>
                    </div>
                    <div slot="right">
                        <Button buttonText="Fjern" onClick={() => removeCertification(tempCert)}><IconDelete slot="before" /></Button>
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
                        <p>{cert.year || 'Ukjent periode'}</p>
                    </div>
                </InnerCard>
            {/each} 
        {/if}
    </div>
</Card>
<style>

</style>