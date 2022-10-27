<script>
    import { get } from 'svelte/store'
    import { cardAction, editingPersonalia, infoOpen } from '../lib/services/store'
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
    export let actionable = false
    export let actionSuccessMsg = "Fullført"
    export let isActioningText = "Noe gjøres..."
    export let actionButtonText = "Åpne gjør noe"
    export let actionOKButtonText = "Gjør noe"
    export let actionCancelButtonText = "Avbryt"
    export let actionRetryButtonText = "Prøv igjen"
    export let canSave = true
    export let saveFunc = async () => { // Only need if editable
        console.log('Æ lagrer')
    }
    export let cancelFunc = async () => { // Only need if editable
        console.log('Æ kansellerer')
    }
    export let actionFunc = async () => { // Only needed if actionable
        console.log('Æ jobbær')
    }

    // State
    let isSaving = false
    let isActioning = false
    let saveError = false
    let actionError = false
    let showInfoBox = false
    let showSavedMsg = false
    let showActionMsg = false
    let successTimeout = null
    let isInfoBoxOpen = false

    let topOfCard = 0

    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    let actionInfo = get(cardAction)
    cardAction.subscribe(value => {
        actionInfo = value
    })

    infoOpen.subscribe(value => {
        if(value !== title) {
            showInfoBox = false
            isInfoBoxOpen = false
        } else if (value === title) {
            showInfoBox = true
        }
    })

    const sleep = ms => new Promise(r => {successTimeout = setTimeout(r, ms)})

    const openEdit = () => {
        if (!editInfo.isEditing) {
            // topOfCard = document.getElementById(title).getBoundingClientRect().top + window.scrollY - 10
            topOfCard = window.scrollY
            resetSuccessMsg()
            editingPersonalia.set({ isEditing: true, editBlock: title })
        } else if (editInfo.isEditing && editInfo.editBlock !== title) {
            alert(`Du redigerer allerede ${editInfo.editBlock}, vennligst fullfør eller avbryt denne redigeringen først`)
        }
    }

    const openAction = () => {
        if (!actionInfo.open) {
            topOfCard = window.scrollY
            resetSuccessMsg()
            cardAction.set({ open: true, block: title })
        } else if (actionInfo.open && actionInfo.block !== title) {
            alert(`Du har allerede en action åpen i ${actionInfo.block}, vennligst fullfør eller avbryt den først`)
        }
    }

    const cancelEdit = () => {
        saveError = null
        resetSuccessMsg()
        cancelFunc()
        editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
        scrollIfNeeded()
    }

    const cancelAction = () => {
        actionError = null
        resetSuccessMsg()
        cancelFunc()
        cardAction.set({ open: false, block: 'ingen' })
        scrollIfNeeded()
    }

    const showSuccess = async type => {
        if (type === 'save') {
            showSavedMsg = true
            await sleep(4000)
            showSavedMsg = false
        } else if (type === 'action') {
            showActionMsg = true
            await sleep(4000)
            showActionMsg = false
        }
    }

    const resetSuccessMsg = () => {
        showSavedMsg = false
        showActionMsg = false
        clearTimeout(successTimeout)
    }

    const scrollIfNeeded = () => {
        /*
        const elm = document.getElementById(title)
        const rect = elm.getBoundingClientRect()
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
        const needToScroll = (rect.top < 0)
        console.log(title, elm)
        if (needToScroll || true) {
            console.log('må scrolle')
           elm.scrollIntoView({ behavior: 'smooth' })
        }*/
        /*
        setTimeout(() => {
            window.scrollTo(
                {
                    top: topOfCard,
                    left: 0,
                    behavior: 'smooth'
                }
            )
        }, 0.1)*/
        window.scrollTo({ top: topOfCard, left: 0, behavior: 'smooth' })
    }

    const saveChanges = async () => {
        if (canSave) {
            saveError = null
            resetSuccessMsg()
            isSaving = true
            try {
                await saveFunc()
                scrollIfNeeded()
                isSaving = false
                editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
                await showSuccess('save')
            } catch (error) {
                console.error('saveChanges - Aiaiaiai:', error)
                isSaving = false
                saveError = error.message
                scrollIfNeeded()
            }
        }
    }

    const doAction = async () => {
        actionError = null
        resetSuccessMsg()
        isActioning = true
        try {
            await actionFunc()
            scrollIfNeeded()
            isActioning = false
            cardAction.set({ open: false, block: 'ingen' })
            await showSuccess('action')
        } catch (error) {
                console.error('doAction - Aiaiaiai:', error)
                isActioning = false
                actionError = error.message
                scrollIfNeeded()
            }
    }

    const handleInfoClick = () => {
        isInfoBoxOpen = !isInfoBoxOpen
        if(isInfoBoxOpen === false) {
            infoOpen.set('')
        } else {
            infoOpen.set(title)
        }  
    }
</script>

    <div id={title ?? 'har ikke tittel'} class="panel{(editInfo.isEditing && editInfo.editBlock !== title) ? ' hide' : ''}" style="background-color: var({backgroundColor});">
        {#if title}
            <div class="header">
                <div class="headerTitle">
                    <h3 class="title">{title}</h3>
                    {#if infoBox}
                        <div class="headerIcon" title={showInfoBox ? 'Lukk infoboks' : 'Åpne infoboks'} on:click={() => {handleInfoClick()}}><IconHelp /></div>
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
                        <div class="editButton">
                            {#if showSavedMsg}
                                <div class="success slide fadeInOut">Lagret 👍</div>&nbsp&nbsp
                            {/if}
                            <Button buttonText="Rediger" onClick={() => openEdit()}><IconEdit slot="before" /></Button>
                        </div>
                    {/if}
                {:else if actionable}
                    {#if actionInfo.open && actionInfo.block === title}
                        {#if isActioning}
                            <IconSpinner width="2rem" />
                        {:else if actionError}
                            <span class="error slide fadeIn">😮 {actionError}</span>
                        {/if}
                    {:else}
                        <div class="editButton">
                            {#if showActionMsg}
                                <div class="success slide fadeInOut">{actionSuccessMsg}</div>&nbsp&nbsp
                            {/if}
                            <Button buttonText={actionButtonText} onClick={() => openAction()}><IconHelp slot="before" /></Button>
                        </div>
                    {/if}
                {/if}
            </div>
            {#if infoBox}
                <InfoBox content={infoBox.content} html={true} open={showInfoBox} onClose={() => {handleInfoClick()}} />
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
                        <Button buttonText="Prøv igjen" disabled={!canSave} onClick={saveChanges}><IconRetry slot="before" /></Button>
                        &nbsp&nbsp
                        <Button buttonText="Avbryt" onClick={cancelEdit}><IconClose slot="before" /></Button>
                    </div>
                {:else}
                    <div></div>
                    <div class="saveCancel">
                        <Button buttonText="Lagre" disabled={!canSave} onClick={saveChanges}><IconCheck slot="before" /></Button>
                        &nbsp&nbsp
                        <Button buttonText="Avbryt" onClick={cancelEdit}><IconClose slot="before" /></Button>
                    </div>
                {/if}
            </div>
        {:else if actionInfo.open && actionInfo.block === title}
            <div class="bottomLine">
                {#if isActioning}
                    <div></div>
                    <div class="saveCancel">
                        {isActioningText}
                    </div>
                {:else if actionError}
                    <div></div>
                    <div class="saveCancel">
                        <Button buttonText={actionRetryButtonText} onClick={doAction}><IconRetry slot="before" /></Button> <!-- disabled={!canSave} -->
                        &nbsp&nbsp
                        <Button buttonText={actionCancelButtonText} onClick={cancelAction}><IconClose slot="before" /></Button>
                    </div>
                {:else}
                    <div></div>
                    <div class="saveCancel">
                        <Button buttonText={actionOKButtonText} onClick={doAction}><IconCheck slot="before" /></Button> <!-- disabled={!canSave} -->
                        &nbsp&nbsp
                        <Button buttonText={actionCancelButtonText} onClick={cancelAction}><IconClose slot="before" /></Button>
                    </div>
                {/if}
            </div>
        {/if}

    </div>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        padding-bottom: 0.5rem;
    }
    .headerTitle {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
    .panel {
        margin-bottom: 3rem;
        padding: 40px 32px;
    }
    .headerIcon {
        display: flex;
        align-items: center;
        width: 1.2rem;
        margin-left: 4px;
    }
    .hide {
        color: var(--mork);
        filter: grayscale(100%);
    }
    .hide .headerIcon {
        display: none;
    }
    .hide .editButton {
        display: none;
    }
    .editButton {
        display: flex;
        position: relative;
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

    @media(max-width: 885px) {
        .panel {
            margin-bottom: 2rem;
            padding: 32px 16px;
        }
    }

</style>
