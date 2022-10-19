<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import SelectMonth from "./SelectMonth.svelte"
    import SelectYears from "./SelectYears.svelte"
    import Button from "./Button.svelte"
    import IconAdd from "./Icons/IconAdd.svelte"
    import IconDelete from "./Icons/IconDelete.svelte"
    import InnerCard from "./InnerCard.svelte"

    // Props
    export let title = 'Verv'
    export let backgroundColor = '--potPourri'
    export let competence = {
		experience: []
	}

    if (!competence.experience) competence.experience = []

    // State
    let tempExperience = JSON.parse(JSON.stringify(competence.experience)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    
    let newExperience = {
        fromYear: 2019,
        toYear: 2022,
        fromMonth: 'Januar',
        toMonth: 'Februar',
        type: 'Verv'
    }

    // Validation
    let canSave = false
    let validation = []

    // Reactive validation
    $: {
        canSave = true
        const tempValidation = []
        for (const exp of tempExperience) {
            // What fields are we validating
            const valid = {
                position: true,
                organization: true,
            }
            // Validation of each field
            if (!exp.position || exp.position.length < 1) {
                valid.position = false
                canSave = false
            }
            if (!exp.organization || exp.organization.length < 1) {
                valid.organization = false
                canSave = false
            }

            tempValidation.push(valid)
        }
        validation = JSON.parse(JSON.stringify(tempValidation))
    }

    // Functions
    const addExperience = () => {
		// need to assign as a new object to make it "reactive"
		tempExperience = [ ...tempExperience, newExperience ]
		newExperience = {
            fromYear: 2019,
            toYear: 2022,
            fromMonth: 'Januar',
            toMonth: 'Februar',
            type: 'Verv'
        }
	}

    const removeExperience = exp => {
		tempExperience = tempExperience.filter(workExperience => workExperience !== exp)
	}

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, experience: tempExperience})
            competence.experience = JSON.parse(JSON.stringify(tempExperience))
        } else {
            console.log('Ingen endring, gidder ikke lagre')
        }
	}

    const checkIfChanges = () => {
        if ((competence.experience) !== (tempExperience)) return true
        return false
    }

    const cancelFunc = async () => {
        tempExperience = JSON.parse(JSON.stringify(competence.experience))
    }

    const getPeriod = (exp) => {
        const dates = {
            fromMonth: exp.fromMonth ?? 'Ukjent mnd',
            fromYear: exp.fromYear ?? 'Ukjent år',
            toMonth: exp.toMonth ?? 'Ukjent mnd',
            toYear: exp.toYear ?? 'Ukjent år'
        }
        if (dates.toMonth === 'Dagens dato' || dates.toYear === 'Dagens dato') {
            dates.toYear = ''
            dates.toMonth = 'Dagens dato'
        }
        return `${dates.fromMonth} ${dates.fromYear} - ${dates.toMonth} ${dates.toYear}`
    }

    const infoText = "<p>Dette handler om relevante verv du har hatt de siste årene. Du trenger ikke fylle ut frivillige verv eller verv i fritidsaktiviteter.<p>"

</script>

<Card title={title} editable={true} backgroundColor={backgroundColor} infoBox={ {content: infoText}} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each tempExperience as tempExp, i}
                <InnerCard emoji={'🦸‍♀️'}>
                    <div slot="first">
                        <div>
                            <label for="position">Verv</label><label for="position" class="validation">{!validation[i].position ? '*' : '' }</label>
                            <input id="position" type="text" bind:value={tempExp.position}>
                        </div>
                        <div>
                            <label for="organization ">Organisasjon</label><label for="organization" class="validation">{!validation[i].organization ? '*' : '' }</label>
                            <input id="organization" type="text" bind:value={tempExp.organization}>
                        </div>
                        <div>
                            <label for="from">Fra</label><br>
                            <div class="peroidContainer">
                                <SelectMonth bind:monthValue={tempExp.fromMonth}/>
                                <SelectYears startYear={1950} bind:yearValue={tempExp.fromYear} on:change={() => tempExp.toYear = tempExp.fromYear}/>
                            </div>
                            <label for="to">Til</label><br>
                            <div class="peroidContainer">
                                <SelectMonth addTodaysDate={true} bind:monthValue={tempExp.toMonth}/>
                                    {#if newExperience.fromYear}
                                        <SelectYears startYear={tempExp.fromYear} addTodaysDate={true} bind:yearValue={tempExp.toYear}/>
                                    {/if}
                            </div>
                        </div>
                    </div>
                    <div slot="right">
                        <Button buttonText="Fjern" onClick={() => removeExperience(tempExp)}><IconDelete slot="before" /></Button>
                    </div>
                </InnerCard>
            {/each}
            <Button buttonText="Legg til" onClick={() => addExperience()}><IconAdd slot="before" /></Button>
        {:else if competence.experience.length === 0}
            <div><p>Ingen verv lagt inn</p></div> 
        {:else} 
            {#each competence.experience as exp}
                <InnerCard emoji={'🦸‍♀️'}>
                    <div slot="first">
                        <h3>{exp.position ?? 'Ukjent verv'}</h3>
                        <h4>🏢{exp.organization  ?? 'Ukjent organisasjon'}</h4>
                        <p>📅 {getPeriod(exp)}</p>
                    </div>
                </InnerCard>
            {/each}
        {/if}
    </div>
</Card>

<style>
    label {
        font-size: 0.9em;
        font-weight: bold;
        font-style: italic;
    }

    input[type=text] {
        width: 100%;
        padding: 5px 5px;
        display: inline-block;
        border: 1px solid var(--mork);
        border-radius: 0.5rem;
        box-sizing: border-box;
    }
    .peroidContainer {
        display: flex;
    }
    .validation {
        color: var(--red)
    }

</style>