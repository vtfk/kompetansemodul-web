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
    import { experienceCardHelp } from "../lib/Helpers/helptexts"
    import { array_move } from '../lib/Helpers/moveArray'

    // Props
    export let title = 'Verv'
    export let backgroundColor = '--potPourri'
    export let competence = {
		experience: []
	}
    export let canEdit = true
    export let disableInfoBox = false

    if (!competence.experience) competence.experience = []

    // State
    let tempExperience = JSON.parse(JSON.stringify(competence.experience)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    
    let newExperience = {
        fromYear: 2019,
        toYear: '',
        fromMonth: 'Januar',
        toMonth: '',
        type: 'Verv',
        isActive: true
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
                toMonthOrYear: true,
                toYear: true,
                toMonth: true
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
            if (!exp.isActive && ((!exp.toMonth || exp.toMonth.length < 1) || (!exp.toYear || exp.toYear.length < 1))) {
                valid.toMonthOrYear = false
                canSave = false
            }

            if (!exp.toYear || exp.toYear.lenght < 1) {
                if (!exp.isActive) {
                    valid.toYear = false
                    canSave = false
                }
            }

            if (!exp.toMonth || exp.toMonth < 1) {
                if (!exp.isActive) {
                    valid.toMonth = false
                    canSave = false
                }
            }
            if(exp.fromYear === exp.toYear) {
                const monthsToRestrict = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']
                if(monthsToRestrict.findIndex(i => i === exp.fromMonth) > monthsToRestrict.findIndex(i => i === exp.toMonth)) {
                    valid.toMonth = false
                    canSave = false
                }
            }

            tempValidation.push(valid)
        }
        validation = JSON.parse(JSON.stringify(tempValidation))
    }


    // Reactive state changes
    $: {
        for (const exp of tempExperience) {
            if (exp.isActive) {
                exp.toMonth = ''
                exp.toYear = ''
            }
        }
    }

    // Functions
    const addExperience = () => {
		// need to assign as a new object to make it "reactive"
		tempExperience = [ ...tempExperience, newExperience ]
		newExperience = {
            fromYear: 2019,
            toYear: '',
            fromMonth: 'Januar',
            toMonth: '',
            type: 'Verv',
            isActive: true
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
        const from = `${exp.fromMonth ?? 'Ukjent måned'} ${exp.fromYear}`
        return !exp.isActive ? `${from} - ${exp.toMonth ?? 'Ukjent måned'} ${exp.toYear ?? 'Ukjent år'}` : `${from} - pågår`
    }

    const moveExperience = (old_index, new_index) => {
        tempExperience = array_move(tempExperience, old_index, new_index)
    }

</script>

<Card title={title} disableInfoBox={disableInfoBox} editable={canEdit} backgroundColor={backgroundColor} infoBox={ {content: experienceCardHelp}} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each tempExperience as tempExp, i}
                <InnerCard emoji={'🦸‍♀️'}>
                    <div slot="first">
                        <div>
                            <label for="position">Verv</label><label for="position" class="validation">{!validation[i].position ? '*' : '' }</label>
                            <input class="{!validation[i].position ? 'required' : '' }" id="position" type="text" bind:value={tempExp.position}>
                        </div>
                        <div>
                            <label for="organization ">Organisasjon</label><label for="organization" class="validation">{!validation[i].organization ? '*' : '' }</label>
                            <input class="{!validation[i].organization ? 'required' : '' }" id="organization" type="text" bind:value={tempExp.organization}>
                        </div>
                        <div class="checkboxContainer">
                            <input type="checkbox" id="active" bind:checked={tempExp.isActive} />
                            <label for="active">Pågår</label>
                        </div>
                        <div>
                            <label for="from">Fra</label><br>
                            <div class="peroidContainer">
                                <SelectMonth bind:monthValue={tempExp.fromMonth}/>
                                <SelectYears startYear={1950} bind:yearValue={tempExp.fromYear} on:change={() => tempExp.toYear = tempExp.fromYear}/>
                            </div>
                        </div>
                        {#if !tempExp.isActive }
                            <div>
                                <label for="to">Til</label><label for="to" class='validation'>{!validation[i].toMonthOrYear ? '*' : '' }</label><br>
                                <div class="peroidContainer">
                                    {#if tempExp.toYear === tempExp.fromYear}
                                        <SelectMonth bind:monthValue={tempExp.toMonth} validation={true} validated={validation[i].toMonth} fromMonth={tempExp.fromMonth}/>
                                    {:else}
                                        <SelectMonth bind:monthValue={tempExp.toMonth} validation={true} validated={validation[i].toMonth} />
                                    {/if}
                                    {#if newExperience.fromYear}
                                        <SelectYears startYear={tempExp.fromYear} bind:yearValue={tempExp.toYear} validation={true} validated={validation[i].toYear} />
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    </div>
                    <div slot="right">
                        <Button buttonText="Fjern" onClick={() => removeExperience(tempExp)}><IconDelete slot="before" /></Button>
                        <div class="buttonContainer">
                            <div class="upDownButton">
                                <Button onlyIcon={true} title="Flytt Opp" removeSlots={true} buttonText="⬆" disabled={i === 0} onClick={() => moveExperience(i, (i-1))}></Button>
                            </div>
                            <div class="upDownButton">
                                <Button onlyIcon={true} title="Flytt Ned" removeSlots={true} buttonText="⬇" disabled={i === tempExperience.length-1} onClick={() => moveExperience(i, (i+1))}></Button>
                            </div>
                        </div>
                    </div>
                </InnerCard>
            {/each}
            <Button buttonText="Legg til" onClick={() => addExperience()}><IconAdd slot="before" /></Button>
        {:else if competence.experience.length === 0}
            <div><em>Ingen verv lagt inn</em></div> 
        {:else} 
            {#each competence.experience as exp}
                <InnerCard emoji={'🦸‍♀️'}>
                    <div slot="first">
                        <h3>{exp.position ?? 'Ukjent verv'}</h3>
                        <h4>🏢 {exp.organization  ?? 'Ukjent organisasjon'}</h4>
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
    .peroidContainer {
        display: flex;
    }

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
