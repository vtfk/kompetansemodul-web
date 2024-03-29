<script>
    import Button from "./Button.svelte";
    import IconSpinner from "./Icons/IconSpinner.svelte";
    import { confetti } from '@neoconfetti/svelte';
    import { onMount } from "svelte";

    export let criticalTasks = []
    export let competenceList = []
    export let criticalTasksToSave = []
    export let isSaving = false
    export let savedMsg = ''
    export let error = false
    export let saveCriticalTasks = async () => {
        console.log('Saving')
    }

    let selectedCriticalTasks = []
    let tempSelectedCriticalTasks
    let dialog
    let employee
    let modalError = ''
    let descCrit = ''
    let navnCrit = ''
    let disableDialogButton = false
    let tempCriticalTasks = JSON.parse(JSON.stringify(criticalTasks))

    onMount(() => {
        dialog = document.getElementById('desc-dialog')
    })

    // Reformat the date to a more readable format. 
    const formatDate = (timestamp) => {
        const year = new Date(timestamp).getFullYear()
        const month = new Date(timestamp).getMonth()
        const date = new Date(timestamp).getUTCDate()

        let fulldate = `${date}.${month + 1}.${year}`
        return fulldate
    }

    // All employees with a criticalTask === true is sorted and placed first in the array. 
    const sortList = (list) => {
        return list.sort(function(a, b) { 
            return b.hasCriticalTask - a.hasCriticalTask
        })
    }
    
    const combineData = (critical, competence) => {
        const result = competence.map(emp => {
            const criticalTask = critical.find(task => task.ansattnummer === emp.ansattnummer)
            if(criticalTask) {
                return {
                    ...emp, 
                    hasCriticalTask: criticalTask.criticalTask,
                    modifiedBy: criticalTask.modifiedBy,
                    timestamp: formatDate(criticalTask.timestamp),
                } 
            } else {
                return {
                    ...emp, 
                    hasCriticalTask: false,
                    modifiedBy: '',
                    timestamp: '',
                } 
            }
        })
        return result
    }

    const addToSelected = (array, object) => {
        if(array !== undefined && Array.isArray(array)) {
            for(const row of array) {
                if(row.hasCriticalTask === true) {
                    selectedCriticalTasks.push(row)
                }
            }
        } else if (object !== undefined){
            selectedCriticalTasks.push(object)
        }
        tempSelectedCriticalTasks = selectedCriticalTasks
    }

    // Combines the two arraies before displaying it 
    const combinedData = (combineData(tempCriticalTasks, competenceList))

    // Returns array of true/false for easier handling when chosing what to show the user and not.
    
    const noCriticalDesc = combinedData.map(criticalDesk => criticalDesk.beskrivelse === null && criticalDesk.hasCriticalTask === false)
 
    addToSelected(combinedData)

    const findDiff = (combinedList, arrayToCheckAgainst, valToSearch) => {
        const array = combinedList.filter(s => {
            return s.beskrivelse !== null
        })
        if(valToSearch === 'ansattnummer') {
            const diff = array.filter(({ ansattnummer: val1 }) => !arrayToCheckAgainst.some(({ ansattnummer: val2 }) => val2 === val1))
            return diff
        }
        if(valToSearch === 'navn') {
            const diff = array.filter(({ navn: val1 }) => !arrayToCheckAgainst.some(({ navn: val2 }) => val2 === val1))
            return diff
        }
        if(valToSearch === 'hasCriticalTask') {
            const diff = array.filter(({ hasCriticalTask: val1 }) => !arrayToCheckAgainst.some(({ hasCriticalTask: val2 }) => val2 === val1))
            return diff
        }
    }

    const dataToSave = (data) => {
        const diff = findDiff(combinedData, data, 'ansattnummer')
        const isCritical = data.map(s => {
            return {
                ansattnummer: s.ansattnummer,
                criticalTask: true,
                modifiedBy: '',
                timestamp: ''
            }
        })

        const isNotCritical = diff.map(s => {
            return {
                ansattnummer: s.ansattnummer,
                criticalTask: false,
                modifiedBy: '',
                timestamp: ''
            }
        })
        const combinedArray = isCritical.concat(isNotCritical) 
        criticalTasksToSave = []
        criticalTasksToSave.push(combinedArray)
        saveCriticalTasks()
    }

    const showDialog = (asModal = true, ansattnummer) => {
        disableDialogButton = false

        if(tempSelectedCriticalTasks.find(s => s.ansattnummer === ansattnummer) === undefined) {
            disableDialogButton = true
        }

        employee = combinedData.find(s => s.ansattnummer === ansattnummer)

        // Dissable scrolling in background when dialog is open
        document.querySelector("body").style.overflow = 'hidden'
        descCrit = employee.beskrivelse
        navnCrit = employee.navn
		try {
			dialog[asModal ? 'showModal' : 'show']()
		} catch(e) {
			modalError = e.message
		}  
	}

    const closeDialog = () => {
        //Enable scrolling when dialog is closed
        document.querySelector("body").style.overflow = 'visible'
        dialog.close()
    }

    const isCriticalCloseDialog = () => {
        // Oppgaven merkeres og lagres som kritisk og dialogen lukkes. 
        //Enable scrolling when dialog is closed
        document.querySelector("body").style.overflow = 'visible'
        tempSelectedCriticalTasks.push(employee)
        dataToSave(tempSelectedCriticalTasks)
        dialog.close()
    }
    
    const isNotCriticalCloseDialog = () => {
        // Oppgaven merkeres og lagres som kritisk og dialogen lukkes. 
        //Enable scrolling when dialog is closed
        document.querySelector("body").style.overflow = 'visible'
        const index = tempSelectedCriticalTasks.indexOf(employee)
        if(index > -1) {
            tempSelectedCriticalTasks.splice(index, 1)
        }
        dataToSave(tempSelectedCriticalTasks)
        dialog.close()
    }

</script>

<div class="table">
    <div class="criticalHeader">
        <div class="col">Navn</div>
        <div class="col">Lokasjon</div>
        <div class="col">Beskrivelse av solorolle</div>
        <div class="col">Er Oppgaven Kritisk?</div>
        <div class="col">Lagret av</div>
    </div>  
    {#each sortList(combinedData) as criticalTask}
        {#if criticalTask.kritiskOppgave === 'Ja'}
            <div class="criticalRow">
                <div class="col">{criticalTask.navn}</div>
                <div class="col">{criticalTask.arbeidssted}</div>
                <div class="col">
                    {#if criticalTask.beskrivelse.length < 50}
                        {criticalTask.beskrivelse}
                    {:else}
                    <div class="descButton">
                        <Button size="small" removeSlots={true} buttonText="Se beskrivelsen" onClick={ () => showDialog(true, criticalTask.ansattnummer)}></Button>
                    </div>
                    {/if}
                </div>
                <div class="col" style="justify-content:center;">
                    <input type="checkbox" style="margin-right: 0.4rem;" bind:group={tempSelectedCriticalTasks} name="criticalTask" value={criticalTask}/> 
                    <p>Ja, Oppgaven er kritisk</p>
                </div>
                <div class="col" style="width: 50rem;">
                    {#if criticalTask.modifiedBy}
                        {criticalTask.modifiedBy} - {criticalTask.timestamp}
                    {/if}
                </div>
            </div>
        {/if}
    {/each}
    {#if !noCriticalDesc.includes(false)}
        <div class="noDataTable">
            <p>Ingen kritiske oppgaver knyttet til denne enheten</p>
        </div> 
    {/if}
</div>
{#if isSaving === true}
    <div class="centerButton">
        <IconSpinner width="2rem"/>
    </div>
{:else}
    {#if noCriticalDesc.includes(false)}
        {#if findDiff(combinedData, selectedCriticalTasks, 'hasCriticalTask')}
            {#if findDiff(selectedCriticalTasks, tempSelectedCriticalTasks, 'ansattnummer').length > 0 || findDiff(tempSelectedCriticalTasks, selectedCriticalTasks, 'ansattnummer').length > 0 }
                <div class="centerButton">
                    <Button buttonText="Lagre" removeSlots={true} size="medium" onClick={() => {dataToSave(tempSelectedCriticalTasks)}}></Button>
                </div>
            {:else if savedMsg.length <= 0}
            <div class="centerButton">
                <p class="mandatoryInfo">❗Det er ikke gjort noen endringer</p>
            </div>
            {/if}
        {/if}          
    {/if}
{/if}

<div class="centerButton">
    {#if savedMsg.length > 0 && error === false}
        <div class="success">
            {savedMsg}
            <div class="confetti" use:confetti={{stageWidth: 1000, stageHeight: 1000}}/>
        </div>
    {:else if savedMsg.length > 0 && error === true}
        <div class="error">
            {savedMsg}
        </div>
    {:else if modalError.length > 0}
        <div class="error">
            {modalError}
        </div>
    {/if}
</div>

<dialog id="desc-dialog">
    <h2>Beskrivelse av kristisk oppgave for: <br><strong>{navnCrit}</strong></h2>
    <br>
    <h3>Status for den kritiske Oppgaven: <strong>{disableDialogButton === true ? 'Oppgaven er ikke Kritisk' : 'Oppgaven er kristik'}</strong> </h3>
    <div class="dialogContent">
        <p>{descCrit}</p>
    </div>
    <div class="dialogButtons">
        {#if disableDialogButton === false}
            <Button buttonText="Lagre oppgaven som ikke kritisk" removeSlots={true} size="medium" onClick={() => {isNotCriticalCloseDialog()}}></Button>
        {:else}
            <Button buttonText="Lagre oppgaven som kritisk" removeSlots={true} size="medium" onClick={() => {isCriticalCloseDialog()}}></Button>
        {/if}
    </div>
    <div class="dialogButtons">
        <Button buttonText="Lukk" removeSlots={true} size="medium" onClick={() => {closeDialog()}}></Button>
    </div>
</dialog>
<style>
    .table {  
        width: 100%;              
    }
    .criticalHeader {
        background-color: var(--gress-3);
        border-bottom: 0.1rem solid grey;
        color: white;
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-size: 1.2em;
    }
    .criticalRow {
        display: flex;
        font-size: 0.9em;
        justify-content: space-between;
    }
    .col {
        align-items: center;
        display: flex; 
        padding: 0.5rem;
        min-width: 5rem;
        overflow: hidden;
        width: 50rem; 
    }
    .criticalRow:nth-child(even) {
        background-color: var(--sand-2);
    }
    .criticalRow:nth-child(odd) {
        background-color: var(--sand-1);
    }
    .centerButton {
		display: flex;
		justify-content: center;
        margin-top: 1rem;
	}
    .dialogButtons {
        display:flex;
		justify-content: center;
        margin-top: 1rem;
    }
    p {
        font-size: 0.9em;
    }
    .noDataTable {
        display: flex;
        justify-content: center;
        font-size: large;
        padding: 1rem;
        border-bottom: 0.1rem solid grey;
        border-left: 0.1rem solid grey;
        border-right: 0.1rem solid grey;
    }
    .error {
        display: flex;
		justify-content: center;
        padding: 0.4rem 1rem;
        width: 10rem;
        background-color: var(--nype-2);
    }
    .success {
        display: flex;
		justify-content: center;
        padding: 0.4rem 1rem;
        width: 10rem;
        background-color: var(--gress-3);
    }
    dialog {
        position:fixed;
        top: 40%;
        left: calc(50% - 15rem);
        width: 50rem;
        height: 25rem;
        min-height: 25rem;
        min-width: 25rem;
        margin-left: -5rem;
        margin-top: -5rem;
        padding: 2rem;
		border-radius: 5px;
		border-width: 1px;
		transition: all 2s;
	}
	dialog::backdrop {
        background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7));
        animation: fade-in 2s;
    }
    .dialogContent {
        margin-top: 0.5rem;
        font-size: 1.2rem;
        background: #eee;
	    padding: 20px;
    }

    @media(max-width: 915px) {
        .descButton {
            font-size: 0.8rem;
        }

        dialog {
            left: calc(50% - 15rem);
            width: 40rem;
            height: 28rem;
        }
    }

    @media(max-width: 670px) {
        .descButton {
            font-size: 0.6rem;
        }

        dialog {
            left: calc(50% - 13rem);
            width: 35rem;
            height: 28rem;
        }
    }
</style>