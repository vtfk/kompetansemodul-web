<script>
    import { get } from 'svelte/store'
    import { editingPersonalia } from '../lib/services/store';

    export let title = 'Arbeidserfaring'
    export let backgroundColor = '--springWood'
    export let competence = {
        workExperience: []
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

</script>

<div class="panel" style="background-color: var({backgroundColor});">
    <div class="header">
        <h3 class="title">{title}</h3>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            <div>
                <button on:click={() => cancelEdit()}>Avbryt redigering</button>
                <button>Lagre</button>
            </div>
        {:else}
            <button on:click={() => openEdit()}>Rediger</button>
        {/if}
    </div>
    <div id="content">
        <ul>
            {#each competence.workExperience as exp}
                <li>
                    {exp.title ?? 'Ukjent tittel'} ({exp.percent ?? '100'}%) - {exp.company ?? 'Ukjent arbeidsgiver'} - {exp.yearSpan ?? 'Ukjent periode'}
                </li>
            {/each}
        </ul>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            <div>
                <button class='addButton' on:click={() => {}}>Legg til ny arbeidserfaring</button>
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
</style>
