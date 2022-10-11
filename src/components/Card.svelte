<script>
    import { get } from 'svelte/store'
    import { editingPersonalia } from '../lib/services/store'
    import Button from './Button.svelte';
    import IconEdit from './Icons/IconEdit.svelte'
    import IconClose from './Icons/IconClose.svelte';
    import IconSpinner from './Icons/IconSpinner.svelte';
    import IconHelp from './Icons/IconHelp.svelte';
    import IconCheck from './Icons/IconCheck.svelte';
    import InfoBox from './InfoBox.svelte';

    // Props
    export let title = 'Ein tittel'
    export let backgroundColor = '--ecruWhite'
    export let infoBox = undefined // { content: "Det som kommer til å stå på hjelpeboksen, om du vil ha hjelpeboks" }
    export let editable = false
    export let saveFunc = async () => { // Only need if editable
        console.log('Æ lagrer')
    }

    // State
    let isSaving = false
    let saveError = false
    let showInfoBox = false

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

    const saveChanges = async () => {
        isSaving = true
        try {
            await saveFunc()
            console.log('Detta gikk så fint så :)')
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
        <div class="headerTitle">
            <h3 class="title">{title}</h3>
            {#if infoBox}
                <div class="headerIcon" title={showInfoBox ? 'Lukk infoboks' : 'Åpne infoboks'} on:click={() => {showInfoBox = !showInfoBox}}><IconHelp /></div>
            {/if}
        </div>
        {#if editable}
            {#if editInfo.isEditing && editInfo.editBlock === title}
                {#if isSaving}
                    <IconSpinner width="2rem" />
                {:else if saveError}
                    {saveError}
                {/if}
            {:else}
                <Button buttonText="Rediger" onClick={() => openEdit()}><IconEdit slot="before" /></Button>
            {/if}
        {/if}
    </div>
    {#if infoBox}
        <InfoBox content={infoBox.content} open={showInfoBox} onClose={() => {showInfoBox = !showInfoBox}} />
    {/if}
    <div id="content">
        <slot>Her er kortets innhold, hvis du huska å legge det inn. Om du skal kunne redigere kortet MÅ du huske å subscribe på tilhørende edit-store i cardContent</slot>
    </div>
    {#if editInfo.isEditing && editInfo.editBlock === title}
    <div class="bottomLine">
        {#if isSaving}
            <div></div>
            <div class="saveCancel">
                <Button buttonText="Lagrer..." disabled={true}><IconCheck slot="before" /></Button>
                &nbsp&nbsp
                <Button buttonText="Lagrer..." disabled={true}><IconClose slot="before" /></Button>
            </div>
        {:else if saveError}
            <div>{saveError}</div>
            <div class="saveCancel">
                <Button buttonText="Lagre" onClick={saveChanges}><IconCheck slot="before" /></Button>
                &nbsp
                &nbsp
                <Button buttonText="Avbryt" onClick={cancelEdit}><IconClose slot="before" /></Button>
            </div>
        {:else}
            <div></div>
            <div class="saveCancel">
                <Button buttonText="Lagre" onClick={saveChanges}><IconCheck slot="before" /></Button>
                &nbsp&nbsp
                <Button buttonText="Avbryt" onClick={cancelEdit}><IconClose slot="before" /></Button>
            </div>
        {/if}
    </div>
    {/if}

</div>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        padding-bottom: 2rem;
    }
    .headerTitle {
        display: flex;
        align-items: center;
    }
    .panel {
        margin-bottom: 32px;
        padding: 40px 32px;
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
    .bottomLine {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding-top: 2rem;
    }
    .saveCancel {
        display: flex;
    }
</style>