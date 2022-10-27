<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { onMount } from 'svelte'
    import { getPositions, saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import occupations from '../assets/yrker.json'
    import DataList from "./DataList.svelte";
    import SelectMonth from "./SelectMonth.svelte";
    import SelectYears from "./SelectYears.svelte";
    import Button from "./Button.svelte";
    import IconDelete from "./Icons/IconDelete.svelte";
    import IconAdd from "./Icons/IconAdd.svelte";
    import InnerCard from "./InnerCard.svelte";

    let positions = occupations
    onMount(async () => {
        const tempPositions = await getPositions()
        positions.push(...tempPositions.map(pos => {
            return {
                value: pos,
                category: 'Stilling'
            }
        }))
        positions = positions.sort((a, b) => a.category.localeCompare(b.category))
    })

    // Props
    export let title = 'Tidligere arbeidserfaring'
    export let backgroundColor = '--springWood'
    export let competence = {
		workExperience: []
	}

    if (!competence.workExperience) competence.workExperience = []

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // State
    let tempWorkExperience = JSON.parse(JSON.stringify(competence.workExperience)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    // Nedenfor endrer vi antall tasks med maxTasks
    const maxTasks = 5
    tempWorkExperience = tempWorkExperience.map(exp => {
        if (exp.tasks && exp.tasks.length !== maxTasks) {
            for (let i=exp.tasks.length; i < maxTasks; i++) {
                exp.tasks.push('')
            }
        }
        return {
            ...exp,
            tasks: exp.tasks ?? Array(maxTasks).fill('')
        }
    })


    let newWorkExperience = {
        fromYear: 2019,
        toYear: 2022,
        fromMonth: 'Januar',
        toMonth: 'Februar',
        tasks: Array(maxTasks).fill('')
    }

    // Validation
    let canSave = false
    let validation = []

    // Reactive validation
    $: {
        canSave = true
        const tempValidation = []
        for (const exp of tempWorkExperience) {
            // What fields are we validating
            const valid = {
                position: true,
                employer: true,
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

            tempValidation.push(valid)
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
            tasks: Array(maxTasks).fill('')
        }
	}

    const removeWorkExperience = exp => {
		tempWorkExperience = tempWorkExperience.filter(workExperience => workExperience !== exp)
	}

    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, workExperience: tempWorkExperience})
            competence.workExperience = JSON.parse(JSON.stringify(tempWorkExperience))
        } else {
            console.log('Ingen endring, gidder ikke lagre')
        }
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.workExperience) !== JSON.stringify(tempWorkExperience)) return true
        return false
    }

    const cancelFunc = async () => {
        tempWorkExperience = JSON.parse(JSON.stringify(competence.workExperience))
    }

    const infoText ="<p>Dette feltet omfatter tidligere stillinger du har hatt, dvs. ikke den stillingen du har i VTFK per i dag. Ta utgangspunkt i de siste 10-15 årene når du legger inn.</p><br><p>Hvorfor spør vi om dette? Din arbeidserfaring er èn del av din realkompetanse og er dermed nødvendig i forbindelse med kartlegging av din kompetanse.</p>"
</script>

<Card title={title} backgroundColor={backgroundColor} editable={true} infoBox={ {content: infoText}} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each tempWorkExperience as tempWork, i}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        <div>
                            <label for="position">Stilling</label><label for="position" class="validation">{!validation[i].position ? '*' : '' }</label><br>
                            <DataList dataList={positions} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase())} bind:inputValue={tempWork.position} />
                        </div>
                        <div>
                            <div>
                                <label for="employer">Arbeidsgiver</label><label for="employer" class="validation">{!validation[i].employer ? '*' : '' }</label><br>
                                <input id="employer" type="text" bind:value={tempWork.employer}>
                            </div>
                        </div>
                        <div>
                            <label for="sector">Sektor</label><br>
                            <select id="sector" bind:value={tempWork.sector}>
                                <option value="Privat">Privat</option>
                                <option value="Offentlig">Offentlig</option>
                            </select>
                        </div>
                        <div>
                            <label for="from">Fra</label><br>
                            <div class="peroidContainer">
                                <SelectMonth bind:monthValue={tempWork.fromMonth}/>
                                <SelectYears startYear={1950} bind:yearValue={tempWork.fromYear} on:change={() => tempWork.toYear = tempWork.fromYear}/>
                            </div>
                            <label for="to">Til</label><br>
                            <div class="peroidContainer">
                                <SelectMonth bind:monthValue={tempWork.toMonth}/>
                                    {#if newWorkExperience.fromYear}
                                        <SelectYears startYear={tempWork.fromYear} bind:yearValue={tempWork.toYear}/>
                                    {/if}
                            </div>
                        </div>
                    </div>
                    <div slot="second">
                        <div>
                            <label for="tasks">Hovedoppgaver</label><br>
                            {#each tempWork.tasks as task}
                                <input type="text" bind:value={task}>
                            {/each}
                        </div>
                    </div>
                    <div slot="right">
                        <Button buttonText="Fjern" onClick={() => removeWorkExperience(tempWork)}><IconDelete slot="before" /></Button>
                    </div>
                </InnerCard>
            {/each}
            <Button buttonText="Legg til" onClick={() => addWorkExperience()}><IconAdd slot="before" /></Button>
        {:else if competence.workExperience.length === 0}
            <div><p>Ingen arbeidserfaring lagt inn</p></div> 
        {:else}
            {#each competence.workExperience as work}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        <h3>{work.position ?? 'Ukjent stilling'}</h3>
                        <h4>{work.employer ?? 'Ukjent arbeidsgiver'}</h4>
                        <p>{work.sector ?? 'Ukjent'} sektor</p>
                        <p>📅 {(work.fromMonth && work.toMonth) ? `${work.fromMonth} ${work.fromYear} - ${work.toMonth} ${work.toYear}` : 'Ukjent periode'}</p>
                    </div>
                    <div slot="second">
                        {#if work.tasks && work.tasks.length > 0}
                            <label for='noe'>Hovedoppgaver</label><br />
                            {#each work.tasks as task}
                                <div>{task}</div>
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
    .validation {
        color: var(--red)
    }

</style>
