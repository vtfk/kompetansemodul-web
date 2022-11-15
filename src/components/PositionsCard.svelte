<script>
    import Card from "./Card.svelte";
    import { onMount } from 'svelte'
    import { getZipCodeInfo } from '../lib/Helpers/zipCode'
    import InnerCard from "./InnerCard.svelte";
    import { get } from 'svelte/store'
    import { saveCompetence, getTasks, getOrg }  from '../lib/services/useApi'
    import { editingPersonalia, mandatoryCompetence } from '../lib/services/store'
    import DataList from "./DataList.svelte";
    import Button from "./Button.svelte";
    import IconAdd from "./Icons/IconAdd.svelte";
    import IconDelete from "./Icons/IconDelete.svelte";
    import { positionsCardHelp } from '../lib/Helpers/helptexts'

    // Props
    export let title = 'Dagens stillinger og oppgaver'
    export let backgroundColor = '--gin'
    export let employeeData = {}
    export let canEdit = true
    export let disableInfoBox = false
    export let competence = {
		positionTasks: []
	}

    if (!competence) competence = { positionTasks: [] }
    if (!competence.positionTasks) competence.positionTasks = []
    if (!competence.otherPositions) competence.otherPositions = []
    
   

    // state
    let availableTasks = {}

    // Add tasks if needed
    for (const forhold of employeeData.aktiveArbeidsforhold) {
        const positionTask = competence.positionTasks.find(task => task.positionId === forhold.systemId)
        const level = forhold.arbeidssted.struktur.length > 4 ? forhold.arbeidssted.struktur.length - 4 : 0
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

    const validateMandatoryData = () => {
        // Store card validation
        const mandatoryData = get(mandatoryCompetence)
        mandatoryData.positionTasks = competence.positionTasks.map(t => {
            console.log(t)
            return {
                department: t.positionParent ?? 'ukjent',
                hasData: Array.isArray(t.tasks) && t.tasks.length > 0 ? true : false
            }
        })
        mandatoryCompetence.set(mandatoryData)
    }

    // Run if needed (usually at start)
    if (get(mandatoryCompetence).positionTasks.length !== employeeData.aktiveArbeidsforhold.length) {
        validateMandatoryData()
    }

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // State
    let tempPositionTasks = JSON.parse(JSON.stringify(competence.positionTasks)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    let tempOtherPositions = JSON.parse(JSON.stringify(competence.otherPositions))

    let newOtherPosition = {
        systemId: new Date().toISOString(),
        title: ''
    }

    const updateAvailableTasks = async (force = false) => {
        if ((editInfo.isEditing && editInfo.editBlock === title) || force) {
            for (const kortnavn of Object.keys(availableTasks)) {
                availableTasks[kortnavn] = await getTasks(kortnavn)
            }
        }
    }
    
    onMount(async () => {
        if (canEdit) {
            await updateAvailableTasks(true)
            const interval = setInterval(updateAvailableTasks, 30000);
            return () => clearInterval(interval)
        }
	})


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
            await saveCompetence({...competence, positionTasks: tempPositionTasks, otherPositions: tempOtherPositions})
            competence.positionTasks = JSON.parse(JSON.stringify(tempPositionTasks))
            competence.otherPositions = JSON.parse(JSON.stringify(tempOtherPositions))
            // Store card validation
            validateMandatoryData()
        }
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.positionTasks) !== JSON.stringify(tempPositionTasks)) return true
        if (JSON.stringify(competence.otherPositions) !== JSON.stringify(tempOtherPositions)) return true
        return false
    }

    const cancelFunc = async () => {
        tempPositionTasks = JSON.parse(JSON.stringify(competence.positionTasks))
        tempOtherPositions = JSON.parse(JSON.stringify(competence.otherPositions))
    }

    const addTask = async (position) => {
		tempPositionTasks.find(task => task.positionId === position.systemId).tasks.push('')
        tempPositionTasks = tempPositionTasks
        await updateAvailableTasks(true)
	}

    const removeTask = (position, i) => {
        tempPositionTasks.find(task => task.positionId === position.systemId).tasks.splice(i, 1)
        tempPositionTasks = tempPositionTasks
    }

    const addOtherPosition = () => {
		// need to assign as a new object to make it "reactive"
		tempOtherPositions = [ ...tempOtherPositions, newOtherPosition ]
        tempPositionTasks.push(
            {
                positionId: newOtherPosition.systemId,
                positionParent: 'Ingen enda',
                tasks: []
            }
        )
		newOtherPosition = {
            systemId: new Date().toISOString(),
            title: ''
        }
	}

    const removeOtherPosition = pos => {
		tempOtherPositions = tempOtherPositions.filter(position => position !== pos)
        tempPositionTasks = tempPositionTasks.filter(task => task.positionId !== pos.systemId)
	}
    
    
    // Reactive validation of tasks
    let canSave = true
    let validation = []
    let otherValidation = []
    
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
            validation[positionTask.positionId] = JSON.parse(JSON.stringify(tempValidation))
        }
        const tempOtherValidation = []
        for (const pos of tempOtherPositions) {
            // What fields are we validating
            const valid = {
                title: true,
            }
            // Validation of each field
            if (!pos.title || pos.title.length < 1) {
                valid.title = false
                canSave = false
            }

            tempOtherValidation.push(valid)
        }
        otherValidation = JSON.parse(JSON.stringify(tempOtherValidation))
    }
    // Reactive validation of otherTasks

    const getAvailableTasks = (position, tempPT) => {
        const tempTask = tempPT.find(pt => pt.positionId === position.systemId)
        const test = availableTasks[tempTask.positionParent].filter(task => {
            return !tempTask.tasks.some(t => {
                return t === task.value
            })
        })
        return test
    }
</script>

<Card title={title} backgroundColor={backgroundColor} disableInfoBox={disableInfoBox} infoBox={ {content: positionsCardHelp}} editable={canEdit} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div class="halla">
        {#if editInfo.isEditing && editInfo.editBlock === title}
        <!-- Data fra HR -->
            {#each displayData.positions as position, i}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        <h3>{position.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(position.lonnsprosent/100)}%)</h3>
                        <h4>{getDepartment(position.arbeidssted.struktur).department}</h4>
                        <p>{getDepartment(position.arbeidssted.struktur).company}</p>
                        {#if position.arbeidssted.struktur.length > 2}
                            <p><strong>Leder: </strong>{position.arbeidssted?.leder?.navn === `${employeeData.fornavn} ${employeeData.etternavn}` ? position.arbeidssted.struktur[1].ledernavn : position.arbeidssted?.leder?.navn ?? 'Ukjent leder'}</p>
                        {/if}
                    </div>
                    <div slot="second">
                        <div>
                            <label for="tasks">Nøkkeloppgaver i denne stillingen</label><br>
                            <p class="keytaskInfo">I stikkordsform</p>
                            {#each tempPositionTasks.find(pt => pt.positionId === position.systemId).tasks as task, i}
                                <div class="tasks">
                                    <DataList maxLength={45} dataList={getAvailableTasks(position, tempPositionTasks)} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase()) } bind:inputValue={task} validation={true} validated={validation[position.systemId][i]} />
                                    <label for={i.toString()} class="validation">{!validation[position.systemId][i] ? '*' : '' }</label>
                                    <Button size="medium" onlyIcon={true} noBorder={true} onClick={() => removeTask(position, i)}><IconDelete slot="before"/></Button>
                                </div>
                            {/each}
                            <Button size="small" buttonText="Legg til" onClick={() => addTask(position)}><IconAdd slot="before" /></Button>
                        </div>
                    </div>
                </InnerCard>  
            {/each}
            <!-- Data fra Competence db -->
            <br />
            <h3>Andre roller og oppgaver</h3>
            <h4>Som ikke dekkes i stillingene over</h4>
            {#each tempOtherPositions as position, i}
                <InnerCard emoji='🛠' size="medium">
                    <div slot="first">
                        <label for="posTitle-{i}">Rolle</label><label for="subject" class="validation">{!otherValidation[i].title ? '*' : '' }</label>
                        <input class="{!otherValidation[i].title ? 'required' : '' }" type="text" placeholder="F. eks 'Prosjektarbeid'" bind:value={position.title}  />
                    </div>
                    <div slot="second">
                        <label for="tasks">Oppgaver</label><br>
                        {#each tempPositionTasks.find(pt => pt.positionId === position.systemId).tasks as task, i}
                            <div class="tasks">
                                <DataList maxLength={45} dataList={[]} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase()) } bind:inputValue={task} validation={true} validated={validation[position.systemId][i]} />
                                    <label for={i.toString()} class="validation">{!validation[position.systemId][i] ? '*' : '' }</label>
                                <Button size="medium" onlyIcon={true} noBorder={true} onClick={() => removeTask(position, i)}><IconDelete slot="before"/></Button>
                            </div>
                        {/each}
                        <Button size="small" buttonText="Legg til" onClick={() => addTask(position)}><IconAdd slot="before" /></Button>
                    </div>
                    <div slot="right">
                        <Button buttonText="Fjern" onClick={() => removeOtherPosition(position)}><IconDelete slot="before" /></Button>
                    </div>
                </InnerCard>  
            {/each}
            <Button buttonText="Legg til" onClick={() => addOtherPosition()}><IconAdd slot="before" /></Button>
        {:else}
            <!-- Data fra HR -->
            {#each displayData.positions as position}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        <h3>{position.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(position.lonnsprosent/100)}%)</h3>
                        <h4>{getDepartment(position.arbeidssted.struktur).department}</h4>
                        <p>{getDepartment(position.arbeidssted.struktur).company}</p>
                        {#if position.arbeidssted.struktur.length > 2}
                            <p><strong>Leder: </strong>{position.arbeidssted?.leder?.navn === `${employeeData.fornavn} ${employeeData.etternavn}` ? position.arbeidssted.struktur[1].ledernavn : position.arbeidssted?.leder?.navn ?? 'Ukjent leder'}</p>
                        {/if}
                    </div>
                    <div slot="second">
                        <label for="keytasks">Nøkkeloppgaver i denne stillingen</label>
                        {#if !(competence.positionTasks.find(pt => pt.positionId === position.systemId)).tasks.find(t => t.length > 0)}
                            <div><em>Ingen nøkkeloppgaver lagt inn</em></div>
                        {:else}
                            {#each competence.positionTasks.find(pt => pt.positionId === position.systemId).tasks as task}
                                <div>{task}</div>
                            {/each}
                        {/if}
                    </div>
                </InnerCard>     
            {/each}
            <!-- Data fra Competence db -->
            <br />
            <h3>Andre roller og oppgaver</h3>
            {#each competence.otherPositions as position}
                <InnerCard emoji='🛠' size="medium">
                    <div slot="first">
                        <label for="role">Rolle</label>
                        <h4>{position.title ?? 'Ukjent tittel'}</h4>
                        <!--<h4>{getDepartment(position.arbeidssted.struktur).department}</h4>-->
                    </div>
                    <div slot="second">
                        <label for="tasks">Oppgaver</label>
                        {#if !(competence.positionTasks.find(pt => pt.positionId === position.systemId)).tasks.find(t => t.length > 0)}
                            <div><em>Ingen underoppgaver lagt inn</em></div>
                        {:else}
                            {#each competence.positionTasks.find(pt => pt.positionId === position.systemId).tasks as task}
                                <div>{task}</div>
                            {/each}
                        {/if}
                    </div>
                </InnerCard>     
            {/each}
            {#if competence.otherPositions.length < 1}
                <div><em>Ingen oppgaver lagt inn</em></div>
            {/if}
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
    .keytaskInfo {
        font-size: 0.7rem;
        font-style: italic;
    }
</style>
