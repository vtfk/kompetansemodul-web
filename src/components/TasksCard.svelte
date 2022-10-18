<script>
    import Card from "./Card.svelte";
    import InnerCard from "./InnerCard.svelte";
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import Button from "./Button.svelte";
    import IconAdd from "./Icons/IconAdd.svelte";

    // Props
    export let title = 'Nøkkeloppgaver i dagens stilling'
    export let backgroundColor = '--springWood'
    export let competence = {
		tasks: []
	}
    
   let test = {
        main: ['1', '2', '3', '7', '8'],
        other: ['4', '5', '6']
    }

    if (!competence.tasks) competence.tasks = []

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // State
    let tempTasks = JSON.parse(JSON.stringify(competence.tasks)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit

    // const removeWorkExperience = exp => {
	// 	tempWorkExperience = tempWorkExperience.filter(workExperience => workExperience !== exp)
	// }

    let newMainTask = {
        main:'',
    }


    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, tasks: tempTasks})
            competence.tasks = JSON.parse(JSON.stringify(tempTasks))
        } else {
            console.log('Ingen endring, gidder ikke lagre')
        }
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.tasks) !== JSON.stringify(tempTasks)) return true
        return false
    }

    const cancelFunc = async () => {
        tempTasks = JSON.parse(JSON.stringify(competence.tasks))
    }

    const addMainTask = () => {
		tempTasks = [ ...tempTasks, newMainTask ]
		newMainTask = {
            main: ''
        }
	}

    
    const addOtherTask = () => {
        console.log('other task added')
    }
</script>

<Card title={title} editable={false} backgroundColor={backgroundColor} infoBox={ {content: "Her skriver du inn oppgavene du driver med I STIKKORDSFORM"}} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            <InnerCard emoji='💼'>
                <div slot="first">
                    <label for='mainPos'>Hovedoppgaver</label><br />
                    <!-- {#each tempTasks.main as main}
                        <input type="text" bind:value={main}>
                    {/each} -->
                    <div>{console.log(tempTasks)}</div>
                    <Button buttonText="Legg til" onClick={() => addMainTask()}><IconAdd slot="before" /></Button>
                </div>
                <div slot="second">
                    <label for='otherPos'>Andre oppgaver</label><br />
                    <Button buttonText="Legg til" onClick={() => addOtherTask()}><IconAdd slot="before" /></Button>
                </div>
            </InnerCard>
                {:else if competence.tasks.length === 0}
                    <div>
                        <label for="mainPos">Knyttet til min hovedstilling</label>
                        <div>Jeg driver med ditt og datt, men bidrar ikke stort</div>
                        <label for="otherTasks">Andre oppgaver</label>
                        <div>Jeg driver med ditt og datt, men bidrar ikke stort</div>
                    </div>
                {:else}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        {#each competence.tasks as task }
                            {#if task.main && task.main.length > 0}
                            <label for='mainPos'>Hovedoppgaver</label><br />
                            {#each task.main as main}
                                <div>{main ?? 'Ingen hovedoppgaver'}</div>
                            {/each}
                            {/if}
                        {/each}
                    </div>
                    <div slot="second">
                        {#each competence.tasks as task }
                            {#if task.other && task.other.length > 0}
                                <label for='otherTasks'>Andre oppgaver</label><br />
                                {#each task.other as other}
                                    <div>{other ?? 'Ingen andre oppgaver'}</div>
                                {/each}
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
</style>