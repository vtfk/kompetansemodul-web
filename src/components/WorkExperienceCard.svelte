<script>
    import { get } from 'svelte/store'
    import capitalize from 'capitalize'
    import uniq from 'lodash.uniq'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import SearchBar from './SearchBar.svelte';
    import Button from './Button.svelte';
    import TableButton from './TableButton.svelte';
    import IconEdit from './Icons/IconEdit.svelte';
    import IconDelete from './Icons/IconDelete.svelte';
    import IconAdd from './Icons/IconAdd.svelte';
    import IconCheck from './Icons/IconCheck.svelte';
    import IconClose from './Icons/IconClose.svelte';
    import IconSpinner from './Icons/IconSpinner.svelte';
    import IconHelp from './Icons/IconHelp.svelte';
    import InfoBox from './InfoBox.svelte';

    import occupations from '../assets/yrkerSSB.json'

    // Props
    export let title = 'Arbeidserfaring'
    export let backgroundColor = '--springWood'
    export let competence = {
		workExperience: []
	}

    if (!competence.workExperience) competence.workExperience = []

    // State
    let isSaving = false
    let saveError = false
    let showInfoBox = false
    let positionValue = ''

    // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    let tempWorkExperience = [...competence.workExperience]

    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    const openEdit = () => {
        if (!editInfo.isEditing) {
            editingPersonalia.set({ isEditing: true, editBlock: title })
        } else if (editInfo.isEditing && editInfo.editBlock !== title) {
            alert(`Du redigerer allerede ${editInfo.editBlock}, vennligst fullfør eller avbryt denne redigeringen først`)
        }
    }

    const cancelEdit = () => {
        competence.workExperience = [...tempWorkExperience]
        editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
    }

    let newWorkExperience = {}
    const addWorkExperience = () => {
		// need to assign as a new object to make it "reactive"
        newWorkExperience.position = positionValue
		competence.workExperience = [ ...competence.workExperience, newWorkExperience ]
		newWorkExperience = {}
        positionValue = ''
	}
    const removeWorkExperience = exp => {
		competence.workExperience = competence.workExperience.filter(experience => experience !== exp)
	}

    // TODO: remove error msg if user tries again
    const saveCompetencee = async () => {
        isSaving = true
		try {
            if (JSON.stringify(tempWorkExperience) !== JSON.stringify(competence.workExperience)) {
                await saveCompetence(competence)
                console.log('Detta gikk så fint så :)')
                tempWorkExperience = [...competence.workExperience]
            } else {
                console.log('Ingen endring, gidder ikke lagre')
            }
            isSaving = false
            editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
		} catch (error) {
			console.error('Aiaiaiai:', error)
            isSaving = false
            saveError = error.message
		}
	}

    const stillingSearch = async query => {
        const foundOccupations = occupations.filter(occupation => occupation.name.toLowerCase().startsWith(query.toLowerCase())).map(occupation => {
            if (occupation.name.includes('(')) return occupation.name.slice(0, occupation.name.indexOf('(') - 1)
            return occupation.name
        })
        
        return uniq(foundOccupations.sort().slice(0, 10))
    }

    const stillingPreviewMapper = (input) => {
        return input.map(item => {
            return {
                first: capitalize(item),
                second: '',
                third: '',
                onClick: () => {
                    positionValue = capitalize(item)
                }
            }
        })
    }

</script>

<div class="panel" style="background-color: var({backgroundColor});">
    <div class="header">
        <div class="headerTitle"><h3 class="title">{title}</h3><div class="headerIcon" title={showInfoBox ? 'Lukk infoboks' : 'Åpne infoboks'} on:click={() => {showInfoBox = !showInfoBox}}><IconHelp /></div></div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#if isSaving}
                <IconSpinner width="2rem" />
            {:else if saveError}
                {saveError}
                <Button buttonText="Avbryt redigering" onClick={() => cancelEdit()}><IconClose slot="before" /></Button>
            {:else}
                <Button buttonText="Avbryt redigering" onClick={() => cancelEdit()}><IconClose slot="before" /></Button>
            {/if}
        {:else}
            <Button buttonText="Rediger" onClick={() => openEdit()}><IconEdit slot="before" /></Button>
        {/if}
    </div>
    <InfoBox open={showInfoBox} onClose={() => {showInfoBox = !showInfoBox}} />
    <div id="content">
        <table class="cardTable">
            <tr>
                <th>Arbeidsgiver</th>
                <th>Stilling</th>
                <th>Bransje?</th>
                <th>Periode</th>
                <th>Oppgaver?</th>
            </tr>
            {#each competence.workExperience as exp}
                <tr>
                    <td>{exp.employer ?? 'Ukjent arbeidsgiver'}</td>
                    <td>{exp.position ?? 'Ukjent stilling'}</td>
                    <td>{exp.field ?? 'Ukjent bransje eller no'}</td>
                    <td>{exp.yearSpan ?? 'Ukjent periode'}</td>
                    <td>{exp.mainTasks ?? 'Ukjente oppgaver'}</td>
                    {#if editInfo.isEditing && editInfo.editBlock === title}
                        <td class="actionCol"><TableButton size="small" onClick={() => removeWorkExperience(exp)} ><IconDelete /></TableButton></td>
                    {/if}
                </tr>
            {/each}
            {#if editInfo.isEditing && editInfo.editBlock === title}
                <tr class="editRow">
                    <td><input type="text" id="employer" size="15" bind:value={newWorkExperience.employer} /></td>
                    <td>
                        <SearchBar
                            debounceMs={0}
                            placeholder=''
                            showClear={false}
                            showSearch={false}
                            showPreview={true}
                            search={stillingSearch}
                            previewMapper={stillingPreviewMapper}
                            showSelected={true}
                            textInputStyle={true}
                            bind:searchValue={positionValue}
                        />
                    </td>
                    <td><input type="text" id="field" size="9" bind:value={newWorkExperience.field} /></td>
                    <td><input type="text" id="yearSpan" size="15" bind:value={newWorkExperience.yearSpan} /></td>
                    <td><input type="text" id="mainTasks" size="15" bind:value={newWorkExperience.mainTasks} /></td>
                    <td class="actionCol"><TableButton size="small" onClick={() => addWorkExperience()}><IconAdd /></TableButton></td>
                </tr>
                {#if isSaving}
                    <br />
                    <Button buttonText="Lagrer..." disabled={true}><IconCheck slot="before" /></Button>
                {:else if saveError}
                    {saveError}
                    <br />
                    <Button buttonText="Lagre endringer" onClick={() => saveCompetencee()}><IconCheck slot="before" /></Button>
                {:else}
                    <br />
                    <Button buttonText="Lagre endringer" onClick={() => saveCompetencee()}><IconCheck slot="before" /></Button>
                {/if}
            {/if}
        </table>
    </div>
</div>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        margin: 0 0 16px 0;
    }
    .headerTitle {
        display: flex;
        align-items: center;
    }
    .panel {
        margin-bottom: 32px;
        padding: 40px 32px;
    }
    .cardTable {
        border-collapse: collapse;
        width: 100%;
    }
    th {
        text-align: left;
        padding-right: 32px;
    }
    td {
        border-bottom: 1px solid black;
        padding: 8px 32px 0px 0px;
    }
    .editRow td {
        border-bottom: none;
    }
    td.actionCol {
        padding: 0px;
    }
    .editRow td.actionCol {
        padding-top: 0.4rem; /* bare for syns skyld... */
    }
    .headerIcon {
        display: flex;
        align-items: center;
        width: 1rem;
        margin-left: 4px;
    }
    .headerIcon:hover {
        cursor: pointer;
        transform: scale(1.2);
    }
    /*
    table tr:nth-child(even) {
        background: #9DCECE;
    }
    */
</style>
