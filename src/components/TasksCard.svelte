<script>
    import Card from "./Card.svelte";
    import InnerCard from "./InnerCard.svelte";
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import Button from "./Button.svelte";
    import IconAdd from "./Icons/IconAdd.svelte";
    import IconDelete from "./Icons/IconDelete.svelte";

    // Props
    export let title = 'Nøkkeloppgaver i dagens stilling'
    export let backgroundColor = '--springWood'
    export let competence = {
		mainTasks: [],
        otherTasks: []
	}

    if (!competence.tasks) competence.tasks = {
		mainTasks: [],
        otherTasks: []
	}

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // State
    let tempMainTasks = JSON.parse(JSON.stringify(competence.mainTasks)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    let tempOtherTasks = JSON.parse(JSON.stringify(competence.otherTasks)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit


    // const removeWorkExperience = exp => {
	// 	tempWorkExperience = tempWorkExperience.filter(workExperience => workExperience !== exp)
	// }

    let newMainTask = {
        main: ''
    }
    let newOtherTask = {
        other: ''
    }


    const saveFunc = async () => {
        if (checkIfChangesInMain()) {
            await saveCompetence({...competence, mainTasks: tempMainTasks})
            competence.mainTasks = JSON.parse(JSON.stringify(tempMainTasks))
        } else {
            console.log('Ingen endring i nøkkeloppgaver, gidder ikke lagre')
        }
        if (checkIfChangesInOther()) {
            await saveCompetence({...competence, otherTasks: tempOtherTasks})
            competence.otherTasks = JSON.parse(JSON.stringify(tempOtherTasks))
        }
        else {
            console.log('Ingen endring i andre oppgaver, gidder ikke lagre')
        }
	}

    const checkIfChangesInMain = () => {
        if (JSON.stringify(competence.mainTasks) !== JSON.stringify(tempMainTasks)) return true
        return false
    }

    const checkIfChangesInOther = () => {
        if (JSON.stringify(competence.otherTasks) !== JSON.stringify(tempOtherTasks)) return true
        return false
    }

    const cancelFunc = async () => {
        tempMainTasks = JSON.parse(JSON.stringify(competence.mainTasks))  
        tempOtherTasks = JSON.parse(JSON.stringify(competence.otherTasks))
    }

    const addMainTask = () => {
		tempMainTasks = [ ...tempMainTasks, newMainTask ]
		newMainTask = {main: ''}
	}

    const addOtherTask = () => {
		tempOtherTasks = [ ...tempOtherTasks, newOtherTask ]
		newOtherTask = {other: ''}
	}

    const removeMainTask = task => {
        console.log(task)
        console.log(tempMainTasks)
        tempMainTasks = tempMainTasks.filter(maintask => maintask !== task)
        console.log(tempMainTasks)
    }

    const removeOtherTask = task => {
        tempOtherTasks = tempOtherTasks.filter(othertask => othertask !== task)
    }
</script>

<Card title={title} editable={true} backgroundColor={backgroundColor} infoBox={ {content: "Her skriver du inn oppgavene du driver med I STIKKORDSFORM"}} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            <InnerCard emoji='💼'>
                <div slot="first">
                    <label for='mainPos'>Nøkkeloppgaver</label><br />
                    {#each tempMainTasks as main, i }
                        <div class="tasks">
                            <input id={i.toString()} type="text" bind:value={tempMainTasks[i].main} placeholder="Hovedoppgave"/>
                            <div class="button">
                                <Button size="medium" noBorder={true} onClick={() => removeMainTask(tempMainTasks[i])}><IconDelete slot="before"/></Button>
                            </div>
                        </div>
                    {/each}
                    <Button size="small" buttonText="Legg til" onClick={() => addMainTask()}><IconAdd slot="before" /></Button>
                </div>
                <div slot="second">
                    <label for='otherPos'>Andre oppgaver</label><br />
                    {#each tempOtherTasks as other, i }
                        <div class="tasks">
                            <input id={i.toString()} type="text" bind:value={tempOtherTasks[i].other} placeholder="Andre oppgaver"/>
                            <Button size="medium" noBorder={true} onClick={() => removeOtherTask(tempOtherTasks[i])}><IconDelete slot="before"/></Button>
                        </div>
                    {/each}
                    <Button size="small" buttonText="Legg til" onClick={() => addOtherTask()}><IconAdd slot="before" /></Button>
                </div>
            </InnerCard>
                {:else if competence.mainTasks.length === 0 && competence.otherTasks.length === 0}
                    <div>
                        <label for="mainPos">Nøkkeloppgaver</label>
                        <div>Ingen nøkkeloppgaver er lagt til</div>
                        <label for="otherTasks">Andre oppgaver</label>
                        <div>Ingen andre oppgaver er lagt til</div>
                    </div>
                {:else}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        <label for='mainPos'>Nøkkeloppgaver</label><br />
                        {#each competence.mainTasks as task}
                            {#if task.main && task.main.length > 0}
                                <div>{task.main ?? 'Ingen nøkkeloppgaver'}</div>
                            {/if}
                        {/each}
                    </div>
                    <div slot="second">
                        <label for='otherTasks'>Andre oppgaver</label><br />
                        {#each competence.otherTasks as task }
                            {#if task.other && task.other.length > 0}
                                <div>{task.other ?? 'Ingen andre oppgaver'}</div>
                            {/if}
                        {/each}
                    </div>          
                </InnerCard>
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

.tasks {
    display: flex;
    margin: 0.25rem
}
</style>