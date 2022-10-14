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
    import IconRetry from './Icons/IconRetry.svelte';

    // Props
    export let title = 'Ein tittel'
    export let backgroundColor = '--ecruWhite'
    export let infoBox = undefined // { content: "Det som kommer til å stå på hjelpeboksen, om du vil ha hjelpeboks" }
    export let editable = false
    export let saveFunc = async () => { // Only need if editable
        console.log('Æ lagrer')
    }
    export let cancelFunc = async () => { // Only need if editable
        console.log('Æ kansellerer')
    }

    // State
    let isSaving = false
    let saveError = false
    let showInfoBox = false
    let showSavedMsg = false
    let successTimeout = null

    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    const sleep = ms => new Promise(r => {successTimeout = setTimeout(r, ms)})

    const openEdit = () => {
        if (!editInfo.isEditing) {
            resetSuccessMsg()
            editingPersonalia.set({ isEditing: true, editBlock: title })
        } else if (editInfo.isEditing && editInfo.editBlock !== title) {
            alert(`Du redigerer allerede ${editInfo.editBlock}, vennligst fullfør eller avbryt denne redigeringen først`)
        }
    }

    const cancelEdit = () => {
        saveError = null
        resetSuccessMsg()
        cancelFunc()
        editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
        scrollIfNeeded()
    }

    const showSuccess = async () => {
        showSavedMsg = true
        await sleep(4000)
        showSavedMsg = false
    }

    const resetSuccessMsg = () => {
        showSavedMsg = false
        clearTimeout(successTimeout)
    }

    const scrollIfNeeded = () => {
        const elm = document.getElementById(title)
        const rect = elm.getBoundingClientRect()
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
        const needToScroll = (rect.top < 0)
        if (needToScroll) elm.scrollIntoView()
    }

    const saveChanges = async () => {
        saveError = null
        resetSuccessMsg()
        isSaving = true
        try {
            await saveFunc()
            scrollIfNeeded()
            isSaving = false
            editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
            await showSuccess()
        } catch (error) {
            console.error('Aiaiaiai:', error)
            isSaving = false
            saveError = error.message
            scrollIfNeeded()
        }
    }

</script>

<div id={title ?? 'har ikke tittel'} class="panel" style="background-color: var({backgroundColor});">
    {#if title}
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
                        <span class="error slide fadeIn">😮 {saveError}</span>
                    {/if}
                {:else}
                    <div style="display: flex; position: relative;">
                        {#if showSavedMsg}
                            <div class="success slide fadeInOut">Lagret 👍</div>&nbsp&nbsp
                        {/if}
                        <Button buttonText="Rediger" onClick={() => openEdit()}><IconEdit slot="before" /></Button>
                    </div>
                {/if}
            {/if}
        </div>
        {#if infoBox}
            <InfoBox content={infoBox.content} open={showInfoBox} onClose={() => {showInfoBox = !showInfoBox}} />
        {/if}
    {/if}
    <div id="content">
        <slot>Her er kortets innhold, hvis du huska å legge det inn. Om du skal kunne redigere kortet MÅ du huske å subscribe på tilhørende edit-store i cardContent</slot>
    </div>
    {#if editInfo.isEditing && editInfo.editBlock === title}
    <div class="bottomLine">
        {#if isSaving}
            <div></div>
            <div class="saveCancel">
                Lagrer...
                <!--
                <Button buttonText="Lagrer..." disabled={true}></Button>
                &nbsp&nbsp
                <Button buttonText="Lagrer..." disabled={true}></Button>
                -->
            </div>
        {:else if saveError}
            <div></div>
            <div class="saveCancel">
                <Button buttonText="Prøv igjen" onClick={saveChanges}><IconRetry slot="before" /></Button>
                &nbsp&nbsp
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
        padding-bottom: 1.5rem;
    }
    .headerTitle {
        display: flex;
        align-items: center;
    }
    .panel {
        margin-bottom: 2rem;
        padding: 40px 32px;
    }
    .headerIcon {
        display: flex;
        align-items: center;
        width: 1.2rem;
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
    .error {
        padding: 0.3rem 1rem;
        background-color: var(--nype-2);
    }
    .success {
        padding: 0.3rem 1rem;
        background-color: var(--gress-3);
    }

    .slide {
        padding: 0.3rem 1rem;
        position: relative;
        right: -5rem;
        -webkit-animation: slide 0.5s forwards;
        animation: slide 0.5s forwards;
        white-space: nowrap;
    }
    .slide.fadeIn {
        -webkit-animation: slide 0.5s forwards, fadein 1s forwards;
        animation: slide 0.5s forwards, fadein 1s forwards;
        opacity: 0;
    }

    .slide.fadeInOut {
        -webkit-animation: slide 0.5s forwards, fadeinout 4s forwards;
        animation: slide 0.5s forwards, fadeinout 4s forwards;
        opacity: 0;
    }

    @-webkit-keyframes slide {
        100% { right: 0; }
    }

    @keyframes slide {
        100% { right: 0; }
    }

    @-webkit-keyframes fadein {
        100% { opacity: 1; }
    }

    @keyframes fadein {
        100% { opacity: 1; }
    }

    @-webkit-keyframes fadeinout {
        50% { opacity: 1; }
    }

    @keyframes fadeinout {
        50% { opacity: 1; }
    }

</style>