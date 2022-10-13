<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import occupations from '../assets/yrker.json'
    import InitialsBadge from "./InitialsBadge.svelte";
    import DataList from "./DataList.svelte";
    import SelectMonth from "./SelectMonth.svelte";
    import SelectYears from "./SelectYears.svelte";
    import Button from "./Button.svelte";
    import IconDelete from "./Icons/IconDelete.svelte";
    import IconAdd from "./Icons/IconAdd.svelte";

    // Props
    export let title = 'Arbeidserfaring'
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

    console.log(tempWorkExperience)

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

</script>

<Card title={title} backgroundColor={backgroundColor} editable={true} infoBox={ {content: "Her kommer det du trenger hjelp til"}} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each tempWorkExperience as tempWork}
                <div class="workContainer">
                    <InitialsBadge size='large' initials='💼' />
                    <div class='workStuff'>
                        <div class="workFlex">
                            <div class="mainStuff">
                                <div class="editWork">
                                    <label for="position">Stilling</label><br>
                                    <DataList dataList={occupations} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase())} bind:inputValue={tempWork.position} />
                                </div>
                                <div class="editWork">
                                    <div>
                                        <label for="employer">Arbeidsgiver</label><br>
                                        <input id="employer" type="text" bind:value={tempWork.employer}>
                                    </div>
                                </div>
                                <div class="editWork">
                                    <label for="sector">Sektor</label><br>
                                    <select id="sector" bind:value={tempWork.sector}>
                                        <option value="Privat">Privat</option>
                                        <option value="Offentlig">Offentlig</option>
                                    </select>
                                </div>
                                <div class="editWork">
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
                            <div class="tasks">
                                <div class="editWork">
                                    <label for="tasks">Hovedoppgaver</label><br>
                                    {#each tempWork.tasks as task}
                                        <input type="text" bind:value={task}>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="deleteButton">
                        <Button buttonText="Fjern" onClick={() => removeWorkExperience(tempWork)}><IconDelete slot="before" /></Button>
                    </div>
                </div>
            {/each}
            <Button buttonText="Legg til" onClick={() => addWorkExperience()}><IconAdd slot="before" /></Button>
        {:else}
            {#each competence.workExperience as work}
                <div class="workContainer">
                    <InitialsBadge size='large' initials='💼' />
                    <div class='workStuff'>
                        <div class='workFlex'>
                            <div class="mainStuff">
                                <h3>{work.position ?? 'Ukjent stilling'}</h3>
                                <h4>{work.employer ?? 'Ukjent arbeidsgiver'}</h4>
                                <p>{work.sector ?? 'Ukjent'} sektor</p>
                                <p>📅 {(work.fromMonth && work.toMonth) ? `${work.fromMonth} ${work.fromYear} - ${work.toMonth} ${work.toYear}` : 'Ukjent periode'}</p>
                            </div>
                            {#if work.tasks && work.tasks.length > 0}
                                <div class='tasks'>
                                    <label for='noe'>Hovedoppgaver</label><br />
                                    {#each work.tasks as task}
                                        <div class="task">{task}</div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</Card>

<style>
    .workContainer {
        position: relative;
        display: flex;
        padding: 1rem 1rem;
        /*background-color: var(--siv-1);*/
        /*border: 1px solid var(--siv-2);*/
        border: 0px solid var(--mork);
        border-radius: 1rem;
        background-color: rgba(163, 163, 163, 0.1);
        margin: 1rem 0;
        /*box-shadow: 0 0 0 4px #aedcea;
        box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.3);*/
    }
    .workFlex {
        display: flex;
        flex-wrap: wrap;
    }
    .mainStuff {
        margin-left: 32px;
        width: 20rem;
    }
    .tasks {
        margin-left: 32px;
        max-width: 20rem;
    }
    label {
        font-size: 0.9em;
        font-weight: bold;
        font-style: italic;
    }
    .task {
        border-left: 0px solid var(--mork);
        border-radius: 1rem;
        margin-right: 1rem;
    }
    /*
    .task:nth-child(4n+0) {
        background-color: var(--grannyApple);
    }
    .task:nth-child(4n-1) {
        background-color: var(--potPourri);
    }
    .task:nth-child(4n-2) {
        background-color: var(--lightBlue);
    }*/
    .deleteButton {
        position: absolute;
        right: 1rem;
    }

    input[type=text], select {
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

</style>