<script>
    import Card from "./Card.svelte";
    import { onMount } from 'svelte'
    import { getZipCodeInfo } from '../lib/Helpers/zipCode'
    import InnerCard from "./InnerCard.svelte";
    import { get } from 'svelte/store'
    import { saveCompetence, getTasks }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import DataList from "./DataList.svelte";
    import Button from "./Button.svelte";
    import IconAdd from "./Icons/IconAdd.svelte";
    import IconDelete from "./Icons/IconDelete.svelte";

    // Props
    export let title = 'Dagens stillinger og oppgaver'
    export let backgroundColor = '--springWood'
    export let employeeData = {}
    export let canEdit = true
    export let competence = {
		positionTasks: []
	}

    if (!competence.positionTasks) competence.positionTasks = []
    

    // state
    let availableTasks = {}
    // Nedenfor endrer vi antall tasks med maxTasks
    const maxTasks = 20
    // Add tasks if needed
    for (const forhold of employeeData.aktiveArbeidsforhold) {
        const positionTask = competence.positionTasks.find(task => task.positionId === forhold.systemId)
        const level = forhold.arbeidssted.struktur.length > 4 ? forhold.arbeidssted.struktur.length - 4 : 0
        console.log(forhold.arbeidssted.struktur[level].kortnavn) // Høre om hvilke oppgaver lederne ønsker å se
        availableTasks[forhold.arbeidssted.struktur[level].kortnavn] = []
        if (!positionTask) {
            competence.positionTasks.push({
                positionId: forhold.systemId,
                positionParent: forhold.arbeidssted.struktur[level].kortnavn,
                tasks: []
            })
        } else if (!positionTask.positionParent || positionTask.positionParent !== forhold.arbeidssted.struktur[level]) {
            positionTask.positionParent = forhold.arbeidssted.struktur[level].kortnavn
        }
    }

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // State
    let tempPositionTasks = JSON.parse(JSON.stringify(competence.positionTasks)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    
    onMount(async () => {
        const updateAvailableTasks = async () => {
            if (editInfo.isEditing && editInfo.editBlock === title) {
                for (const kortnavn of Object.keys(availableTasks)) {
                    availableTasks[kortnavn] = await getTasks(kortnavn)
                }
            }
        }
        const interval = setInterval(updateAvailableTasks, 5000);
        updateAvailableTasks();
        return () => clearInterval(interval)
	});


    const convertDate = (date) => {
        const dateList = date.slice(0,10).split('-')
        return `${dateList[2]}.${dateList[1]}.${dateList[0]}`
    }

    const getDepartment = (structure) => {
        const info = {
            department: structure[0].navn
        }
        if (structure.length === 1) {
            // Must be whaaat, top level?
            info.company = structure[0].navn
        }
        else if (structure.length === 2) {
            // Must be fylkesdirektor level, we use the main company
            info.company = structure[1].navn
        } else if (structure.length === 3) {
            // Must be sector level, we use the main company
            info.company = structure[2].navn
        } else if (structure.length === 4) {
            // Must be section level, we use the sector
            info.company = structure[1].navn
        } else if (structure.length > 4) {
            // Must be something lower like me, we use sector
            info.company = structure[structure.length-3].navn
        } else {
            info.company = 'Ukjent sektor'
        }
        return info
    }

    const infoText = "<p>Dine aktive stillinger i organisajonen. Her legger du inn beskrivelse av dine nøkkeloppgaver i dagens stillinger i Vestfold og Telemark fylkeskommune. Om noe er galt i stillingsinformasjonen din, ta kontakt med nærmeste leder</p><br><p>Hvorfor spør vi om dette? Dette trenger vi for å få en best mulig oversikt over oppgaver som ligger til din stilling i dag. Det er ment å fange opp informasjon om ansatte som kan ha endret nøkkeloppgaver, jobbe i matrise eller midlertidig i prosjekter.</p>"
 
    const displayData = {
        name: `${employeeData.fornavn} ${employeeData.etternavn}`,
        officeLocation: employeeData.azureAd?.officeLocation ?? 'Ukjent kontorplass',
        preLocation: employeeData.azureAd?.city ?? 'Ansatt etter sammenslåing',
        positions: employeeData.aktiveArbeidsforhold,
        category: employeeData.personalressurskategori?.navn ?? 'Ukjent',
        employedSince: employeeData.ansettelsesperiode?.start ? convertDate(employeeData.ansettelsesperiode.start) : '🤷‍♂️',
        zipCode: employeeData.bostedsadresse?.postnummer ?? 'Ukjent postnummer'
    }

    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, positionTasks: tempPositionTasks})
            competence.positionTasks = JSON.parse(JSON.stringify(tempPositionTasks))
        } else {
            console.log('Ingen endring, gidder ikke lagre')
        }
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.positionTasks) !== JSON.stringify(tempPositionTasks)) return true
        return false
    }

    const cancelFunc = async () => {
        tempPositionTasks = JSON.parse(JSON.stringify(competence.positionTasks))
    }

    const addTask = (position) => {
		tempPositionTasks.find(task => task.positionId === position.systemId).tasks.push('')
        tempPositionTasks = tempPositionTasks
	}

    const removeTask = (position, i) => {
        tempPositionTasks.find(task => task.positionId === position.systemId).tasks.splice(i, 1)
        tempPositionTasks = tempPositionTasks
    }
    
    
    // Reactive validation
    let canSave = true
    let validation = []
    
    $: {
        canSave = true
        for (const positionTask of tempPositionTasks) {
            const tempValidation = []
            for (const task of positionTask.tasks) {
                if (!task || task.length < 1) {
                    tempValidation.push(false)
                    canSave = false
                } else {
                    tempValidation.push(true)
                }
            }
            validation[positionTask.positionParent] = JSON.parse(JSON.stringify(tempValidation))
        }
    }


</script>

<Card title={title} backgroundColor={backgroundColor} infoBox={ {content: infoText}} editable={canEdit} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div class="halla">
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each displayData.positions as position, i}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        <h4>{position.hovedstilling ? 'Hovedstilling' : 'Tillegsstilling'}</h4>
                        <h3>{position.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(position.lonnsprosent/100)}%)</h3>
                        <h4>{getDepartment(position.arbeidssted.struktur).department}</h4>
                        <p>{getDepartment(position.arbeidssted.struktur).company}</p>
                        <p><strong>Leder: </strong>{position.arbeidssted?.leder?.navn === `${employeeData.fornavn} ${employeeData.etternavn}` ? position.arbeidssted.struktur[1].ledernavn : position.arbeidssted?.leder?.navn ?? 'Ukjent leder'}</p>
                    </div>
                    <div slot="second">
                        <div>
                            <label for="tasks">Nøkkeloppgaver</label><br>
                            {#each tempPositionTasks.find(pt => pt.positionId === position.systemId).tasks as task, i}
                                <div class="tasks">
                                    <DataList maxLength={30} dataList={availableTasks[tempPositionTasks.find(pt => pt.positionId === position.systemId).positionParent]} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase()) } bind:inputValue={task} />
                                    <label for={i.toString()} class="validation">{!validation[tempPositionTasks.find(pt => pt.positionId === position.systemId).positionParent][i] ? '*' : '' }</label>
                                    <Button size="medium" onlyIcon={true} noBorder={true} onClick={() => removeTask(position, i)}><IconDelete slot="before"/></Button>
                                </div>
                            {/each}
                            <Button size="small" buttonText="Legg til" onClick={() => addTask(position)}><IconAdd slot="before" /></Button>
                        </div>
                    </div>
                </InnerCard>  
            {/each}

        {:else}
            {#each displayData.positions as position}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        <h4>{position.hovedstilling ? 'Hovedstilling' : 'Tillegsstilling'}</h4>
                        <h3>{position.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(position.lonnsprosent/100)}%)</h3>
                        <h4>{getDepartment(position.arbeidssted.struktur).department}</h4>
                        <p>{getDepartment(position.arbeidssted.struktur).company}</p>
                        <p><strong>Leder: </strong>{position.arbeidssted?.leder?.navn === `${employeeData.fornavn} ${employeeData.etternavn}` ? position.arbeidssted.struktur[1].ledernavn : position.arbeidssted?.leder?.navn ?? 'Ukjent leder'}</p>
                    </div>
                    <div slot="second">
                        <label for="tull">Nøkkeloppgaver</label>
                        {#if !(competence.positionTasks.find(pt => pt.positionId === position.systemId)).tasks.find(t => t.length > 0)}
                            <div><p>Ingen nøkkeloppgaver lagt inn</p></div>
                        {:else}
                            {#each competence.positionTasks.find(pt => pt.positionId === position.systemId).tasks as task}
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
    .tasks {
        margin-bottom: 0.20rem;
        display: flex;
    }
</style>
