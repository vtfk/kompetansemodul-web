<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import occupations from '../assets/yrker.json'
    import DataList from "./DataList.svelte";
    import SelectMonth from "./SelectMonth.svelte";
    import SelectYears from "./SelectYears.svelte";
    import Button from "./Button.svelte";
    import IconDelete from "./Icons/IconDelete.svelte";
    import IconAdd from "./Icons/IconAdd.svelte";
    import InnerCard from "./InnerCard.svelte";
    import { workExperienceCardHelp } from '../lib/Helpers/helptexts'
    import { array_move } from '../lib/Helpers/moveArray'

    let positions = occupations

    // Props
    export let title = 'Arbeidserfaring utover dagens stilling'
    export let backgroundColor = '--catSkillWhite'
    export let competence = {
		workExperience: []
	}
    export let canEdit = true
    export let disableInfoBox = false

    if (!competence.workExperience) competence.workExperience = []

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // State
    let tempWorkExperience = JSON.parse(JSON.stringify(competence.workExperience)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    
    let newWorkExperience = {
        fromYear: 2019,
        toYear: 2022,
        fromMonth: 'Januar',
        toMonth: 'Februar',
        tasks: []
    }

    // Validation
    let canSave = false
    let validation = []
    // Reactive validation
    $: {
        canSave = true
        const tempValidation = []
        let index = 0
        for (const exp of tempWorkExperience) {
            // What fields are we validating
            const valid = {
                position: true,
                employer: true,
                toYear: true,
                toMonth: true
            }
            // Validation of each field
            if (!exp.position || exp.position.length < 1) {
                valid.position = false
                canSave = false
            }
            if (!exp.employer || exp.employer.length < 1) {
                valid.employer = false
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

            const tempTaskValidation = []
            for(const task of exp.tasks) {
                if (!task || task < 1) {
                    tempTaskValidation.push(false)
                    canSave = false
                } else {
                    tempTaskValidation.push(true)
                }
            }

            tempValidation.push(valid)
            tempValidation[index].tasks = (JSON.parse(JSON.stringify(tempTaskValidation)))
            index++
        }
        validation = JSON.parse(JSON.stringify(tempValidation))
    }

    // Functions
    const addWorkExperience = () => {
		// need to assign as a new object to make it "reactive"
		tempWorkExperience = [ ...tempWorkExperience, newWorkExperience ]
		newWorkExperience = {
            fromYear: 2019,
            toYear: 2022,
            fromMonth: 'Januar',
            toMonth: 'Februar',
            tasks: []
        }
	}

    const removeWorkExperience = exp => {
		tempWorkExperience = tempWorkExperience.filter(workExperience => workExperience !== exp)
	}

    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, workExperience: tempWorkExperience})
            competence.workExperience = JSON.parse(JSON.stringify(tempWorkExperience))
        } 
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.workExperience) !== JSON.stringify(tempWorkExperience)) return true
        return false
    }

    const cancelFunc = async () => {
        tempWorkExperience = JSON.parse(JSON.stringify(competence.workExperience))
    }

    const addTask = (i) => {
		tempWorkExperience[i].tasks.push('')
        tempWorkExperience = tempWorkExperience
	}

    const removeTask = (tempWork, taskValue, tasksIndex) => {
        tempWork.tasks.splice(tasksIndex, 1)        
        tempWorkExperience = tempWorkExperience
    }

    const moveExperience = (old_index, new_index) => {
        tempWorkExperience = array_move(tempWorkExperience, old_index, new_index)
    }

    const moveTask = (old_index, new_index, tempWorkIndex) => {
        tempWorkExperience[tempWorkIndex].tasks = array_move(tempWorkExperience[tempWorkIndex].tasks, old_index, new_index)
    }
</script>

<Card title={title} backgroundColor={backgroundColor} disableInfoBox={disableInfoBox} editable={canEdit} infoBox={ {content: workExperienceCardHelp}} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each tempWorkExperience as tempWork, i}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        <div>
                            <label for="position">Stilling</label><label for="position" class="validation">{!validation[i].position ? '*' : '' }</label><br>
                            <DataList dataList={positions} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase())} bind:inputValue={tempWork.position} placeholder="Skriv inn stillingstittel eller velg fra listen" validation={true} validated={validation[i].position} />
                        </div>
                        <div>
                            <div>
                                <label for="employer">Arbeidsgiver</label><label for="employer" class="validation">{!validation[i].employer ? '*' : '' }</label><br>
                                <input class="{!validation[i].employer ? 'required' : '' }" id="employer" type="text" bind:value={tempWork.employer}>
                            </div>
                        </div>
                        <div>
                            <label for="sector">Sektor</label><br>
                            <select id="sector" bind:value={tempWork.sector}>
                                <option value="Privat">Privat</option>
                                <option value="Offentlig">Offentlig</option>
                            </select>
                        </div>
                        <div class="checkboxContainer">
                            <input type="checkbox" id="active" bind:checked={tempWork.isActive} />
                            <label for="active">Pågår</label>
                        </div>
                        <div>
                            <label for="from">Fra</label><br>
                            <div class="peroidContainer">
                                <SelectMonth bind:monthValue={tempWork.fromMonth}/>
                                <SelectYears startYear={1950} bind:yearValue={tempWork.fromYear} on:change={() => tempWork.toYear = tempWork.fromYear}/>
                            </div>
                            {#if !tempWork.isActive }
                            <div>
                                <label for="to">Til</label> <label for="to" class='validation'>{!validation[i].toMonth || !validation[i].toYear ? '*' : '' }
                                <div class="peroidContainer">
                                    <SelectMonth bind:monthValue={tempWork.toMonth} validation={true} validated={validation[i].toMonth}/>
                                        {#if newWorkExperience.fromYear}
                                            <SelectYears startYear={tempWork.fromYear} validation={true} validated={validation[i].toYear} bind:yearValue={tempWork.toYear}/>
                                        {/if}
                                </div>
                            </div>
                            {:else}
                                {tempWork.toMonth = ''}
                                {tempWork.toYear = ''}
                            {/if}
                        </div>
                    </div>
                    <div slot="second">
                        <div>
                            <label for="tasks">Nøkkeloppgaver</label><br>
                            {#each  tempWork.tasks as task, j}
                                <div class="tasks">
                                    <input class="{!validation[i].tasks[j] ? 'required' : '' }" type="text" maxlength="45" bind:value={task} />
                                    <label for={task.toString()} class="validation">{!validation[i].tasks[j] ? '*' : '' }</label>
                                    <Button size="medium" onlyIcon={true} noBorder={true} onClick={() => removeTask(tempWork, task, j)} ><IconDelete slot="before"/></Button>
                                    <div class="buttonContainer">
                                        <div class="upDownButtonTask">
                                            <Button onlyIcon={true} noBorder={true} title="Flytt Opp" removeSlots={true} buttonText="⬆" disabled={j === 0} onClick={() => moveTask(j, (j-1), i)}></Button>
                                        </div>
                                        <div class="upDownButtonTask">
                                            <Button onlyIcon={true} noBorder={true} title="Flytt Ned" removeSlots={true} buttonText="⬇" disabled={j === tempWork.tasks.length-1} onClick={() => moveTask(j, (j+1), i)}></Button>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                            <Button size="small" buttonText="Legg til" onClick={() => addTask(i)} ><IconAdd slot="before" /></Button>
                        </div>
                    </div>
                    <div slot="right" class=slot>
                        <Button buttonText="Fjern" onClick={() => removeWorkExperience(tempWork)}><IconDelete slot="before" /></Button>
                        <div class="buttonContainer">
                            <div class="upDownButton">
                                <Button onlyIcon={true} title="Flytt Opp" removeSlots={true} buttonText="⬆" disabled={i === 0} onClick={() => moveExperience(i, (i-1))}></Button>
                            </div>
                            <div class="upDownButton">
                                <Button onlyIcon={true} title="Flytt Ned" removeSlots={true} buttonText="⬇" disabled={i === tempWorkExperience.length-1} onClick={() => moveExperience(i, (i+1))}></Button>
                            </div>
                        </div>
                    </div>
                </InnerCard>
            {/each}
            <Button buttonText="Legg til" onClick={() => addWorkExperience()}><IconAdd slot="before" /></Button>
        {:else if competence.workExperience.length === 0}
            <div><em>Ingen arbeidserfaring lagt inn</em></div> 
        {:else}
            {#each competence.workExperience as work}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        <h3>{work.position ?? 'Ukjent stilling'}</h3>
                        <h4>{work.employer ?? 'Ukjent arbeidsgiver'}</h4>
                        <p>{work.sector ?? 'Ukjent'} sektor</p>
                        <p>📅 {(work.fromMonth && work.toMonth) ? `${work.fromMonth} ${work.fromYear} - ${work.toMonth} ${work.toYear}` : `${work.fromMonth} ${work.fromYear} - `}</p>
                    </div>
                    <div slot="second">
                        <label for='noe'>Nøkkeloppgaver</label><br />
                        {#if work.tasks && work.tasks.length > 0}
                            {#each work.tasks as task, i}
                                {#if task[i] === undefined}
                                    <div><em>Ingen hovedoppgaver lagt inn</em></div>
                                {:else}
                                    <div>{task}</div>
                                {/if}
                            {/each}
                        {/if}
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
    .tasks {
        margin-bottom: 0.20rem;
        display: flex;
    }
    @media(max-width: 885px) {
        .slot {
            display: flex;
            padding-top: 0.5rem
        }
        .upDownButton {
            padding-left: 0.5rem;
            padding-top: 0rem;
        }
    }
</style>
