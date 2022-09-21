<script>
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store';

    export let title = 'Utdanning'
    export let backgroundColor = '--ecruWhite'
    export let competence = {
		education: []
	}

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
        editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
    }

    let newEducation = {}
    const addEducation = () => {
		// need to assign as a new object to make it "reactive"
		competence.education = [ ...competence.education, newEducation ]
		newEducation = {}
	}
    const removeEducation = brukernavn => {
		// competence.education = competence.education.filter(education => education.brukernavn !== brukernavn)
	}

    const saveCompetencee = async () => {
		try {
			await saveCompetence(competence)
			console.log('Detta gikk så fint så :)')
		} catch (error) {
			console.error('Aiaiaiai:', error)
		}
	}

</script>

<div class="panel" style="background-color: var({backgroundColor});">
    {JSON.stringify(newEducation, null, 2)}
    <div class="header">
        <h3 class="title">{title}</h3>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            <div>
                <button on:click={() => cancelEdit()}>Avbryt redigering</button>
                <button on:click={() => saveCompetencee()}>Lagre</button>
            </div>
        {:else}
            <button on:click={() => openEdit()}>Rediger</button>
        {/if}
    </div>
    <div id="content">
        <ul>
            {#each competence.education as edu}
                <li>
                    {edu.degree ?? 'Ukjent grad'} - {edu.subject ?? 'Ukjent fag'} - {edu.yearSpan ?? 'Ukjent start-år'} - {edu.school ?? 'Ukjent skole'}
                </li>
            {/each}
        </ul>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            <div class="editContainer">
                <div class="editElement">
                    <label for="degree">Utdanningsgrad:</label><br />
                    <select name="degree" id="degree" bind:value={newEducation.degree}>
                        <option value="Master">Master</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Årsstudium">Årsstudium</option>
                        <option value="Fagbrev">Fagbrev</option>
                    </select>
                </div>
                <div class="editElement">
                    <label for="subject">Fagområde:</label><br />
                    <input type="text" id="subject" bind:value={newEducation.subject} />
                </div>
                <div class="editElement">
                    <label for="yearSpan">Periode (år):</label><br />
                    <input type="text" id="yearSpan" bind:value={newEducation.yearSpan} />
                </div>
                <div class="editElement">
                    <label for="school">Skole:</label><br />
                    <input type="text" id="school" bind:value={newEducation.school} />
                </div>
                <button class='addButton' on:click={() => addEducation()}>Legg til ny utdanning</button>
            </div>
        {/if}
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
    button {
        padding: 4px;
        margin-bottom: 16px;
    }
    button:hover {
        cursor: pointer;
        background-color: var(--catSkillWhite);
    }
    .addButton {
        margin-top: 16px;
    }
    .editContainer {
        margin-top: 32px;
        display: flex;
        justify-content: space-between;
    }
    .editElement {
        
    }
</style>
