<script>
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import Button from './Button.svelte';
    import TableButton from './TableButton.svelte';
    import IconEdit from './icons/iconEdit.svelte'
    import IconDelete from './Icons/IconDelete.svelte';
    import IconAdd from './Icons/IconAdd.svelte';
    import IconCheck from './Icons/IconCheck.svelte';
    import IconClose from './Icons/IconClose.svelte';
    import IconSpinner from './Icons/IconSpinner.svelte';

    // Props
    export let title = 'Utdanning'
    export let backgroundColor = '--ecruWhite'
    export let competence = {
		education: []
	}

    if (!competence.education) competence.education = []

    // State
    let isSaving = false
    let saveError = false

    // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    let tempEducation = [...competence.education]

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
        competence.education = [...tempEducation]
        editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
    }

    let newEducation = {}
    const addEducation = () => {
		// need to assign as a new object to make it "reactive"
		competence.education = [ ...competence.education, newEducation ]
		newEducation = {}
	}
    const removeEducation = edu => {
		competence.education = competence.education.filter(education => education !== edu)
	}

    // TODO: remove error msg if user tries again
    const saveCompetencee = async () => {
        isSaving = true
		try {
            if (JSON.stringify(tempEducation) !== JSON.stringify(competence.education)) {
                await saveCompetence(competence)
                console.log('Detta gikk så fint så :)')
                tempEducation = [...competence.education]
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

</script>

<div class="panel" style="background-color: var({backgroundColor});">
    <div class="header">
        <h3 class="title">{title}</h3>
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
    <div id="content">
        <table class="cardTable">
            <tr>
                <th>Utdanningsgrad</th>
                <th>Fagområde</th>
                <th>Periode</th>
                <th>Skole</th>
            </tr>
            {#each competence.education as edu}
                <tr>
                    <td>{edu.degree ?? 'Ukjent grad'}</td>
                    <td>{edu.subject ?? 'Ukjent fag'}</td>
                    <td>{edu.yearSpan ?? 'Ukjent start-år'}</td>
                    <td>{edu.school ?? 'Ukjent skole'}</td>
                    {#if editInfo.isEditing && editInfo.editBlock === title}
                        <td class="actionCol"><TableButton size="small" onClick={() => removeEducation(edu)} ><IconDelete /></TableButton></td>
                    {/if}
                </tr>
            {/each}
            {#if editInfo.isEditing && editInfo.editBlock === title}
                <tr class="editRow">
                    <td>
                        <select name="degree" id="degree" bind:value={newEducation.degree}>
                            <option value="Master">Master</option>
                            <option value="Bachelor">Bachelor</option>
                            <option value="Årsstudium">Årsstudium</option>
                            <option value="Fagbrev">Fagbrev</option>
                        </select>
                    </td>
                    <td><input type="text" id="subject" size="20" bind:value={newEducation.subject} /></td>
                    <td><input type="text" id="yearSpan" size="9" bind:value={newEducation.yearSpan} /></td>
                    <td><input type="text" id="school" size="20" bind:value={newEducation.school} /></td>
                    <td class="actionCol"><TableButton size="small" onClick={() => addEducation()}><IconAdd /></TableButton></td>
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
    }
    .panel {
        margin-bottom: 32px;
        padding: 40px 32px;
    }
    .title {
        margin: 0 0 16px 0;
    }
    .cardTable {
        border-collapse: collapse;
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
    /*
    table tr:nth-child(even) {
        background: #9DCECE;
    }
    */
</style>
