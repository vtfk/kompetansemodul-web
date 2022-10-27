<script>
    import Card from "./Card.svelte";
    import { getZipCodeInfo } from '../lib/Helpers/zipCode'
    import InnerCard from "./InnerCard.svelte";
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'

    // Props
    export let title = 'Dagens stillinger'
    export let backgroundColor = '--springWood'
    export let employeeData = {}
    export let canEdit = true
    export let competence = {
		positionTasks: []
	}


    if (!competence.positionTasks) competence.positionTasks = []
    

    // Nedenfor endrer vi antall tasks med maxTasks
    const maxTasks = 5
    // Add tasks if needed
    for (const forhold of employeeData.aktiveArbeidsforhold) {
        if (!competence.positionTasks.find(task => task.positionId === forhold.systemId)) {
            competence.positionTasks.push({
                positionId: forhold.systemId,
                tasks: Array(maxTasks).fill('')
            })
        }
    }

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // State
    let tempPositionTasks = JSON.parse(JSON.stringify(competence.positionTasks)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit

    // usikker på om vi trenger denne???
    tempPositionTasks = tempPositionTasks.map(pos => {
        if (pos.tasks && pos.tasks.length !== maxTasks) {
            for (let i=pos.tasks.length; i < maxTasks; i++) {
                pos.tasks.push('')
            }
        }
        return {
            ...pos,
            tasks: pos.tasks ?? Array(maxTasks).fill('')
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

</script>

<Card title={title} backgroundColor={backgroundColor} infoBox={ {content: infoText}} editable={canEdit} canSave={true} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div class="halla">
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each displayData.positions as position, i}
                <InnerCard emoji='💼'>
                    <div slot="first">
                        <h4>{position.hovedstilling ? 'Hovedstilling' : 'Tillegsstilling'}</h4>
                        <h3>{position.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(position.lonnsprosent/100)}%)</h3>
                        <h4>{getDepartment(position.arbeidssted.struktur).department}</h4>
                        <p>{getDepartment(position.arbeidssted.struktur).company}</p>
                        <p><strong>Leder: </strong>{position.arbeidssted?.leder?.navn ?? 'Ukjent leder'}</p>
                    </div>
                    <div slot="second">
                        <div>
                            <label for="tasks">Nøkkeloppgaver</label><br>
                            {#each tempPositionTasks.find(pt => pt.positionId === position.systemId).tasks as task}
                                <div class="task">
                                    <input type="text" bind:value={task}>
                                </div>
                            {/each}
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
                        <p><strong>Leder: </strong>{position.arbeidssted?.leder?.navn ?? 'Ukjent leder'}</p>
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
    .task {
        margin-bottom: 0.20rem;
    }
</style>
