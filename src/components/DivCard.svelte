<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import { divCardHelp } from '../lib/Helpers/helptexts'

    // Props
    export let title = 'Er du den eneste med din stilling og/eller ansvarsområde i din enhet?'
    export let backgroundColor = '--potPourri'
    export let competence = {
		other: {}
	}
    export let canEdit = true
    export let disableInfoBox = false
    export let setFieldToFinished = (field, val) => {}

    if (!competence.other) competence.other = {}

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // Check if user has completed this card, send up result to parent (remember to run in save function as well)
    const fieldsValidated = () => {
        if (competence.other.soloRole) setFieldToFinished('soloRoleCompleted', true)
        else setFieldToFinished('soloRoleCompleted', false)
    }
    fieldsValidated()

    // State
    let tempOther = JSON.parse(JSON.stringify(competence.other)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    
    // Validation
    let canSave = false

    // Reactive validation
    $: {
        if ((tempOther.soloRole === 'Nei') || (tempOther.soloRoleDescription && tempOther.soloRoleDescription.length > 0)) {
            canSave = true
        } else {
            canSave = false
        }
    }

    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, other: tempOther})
            competence.other = JSON.parse(JSON.stringify(tempOther))
            fieldsValidated()
        } 
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.other) !== JSON.stringify(tempOther)) return true
        return false
    }

    const cancelFunc = async () => {
        tempOther = JSON.parse(JSON.stringify(competence.other))
    }

    const noneSoloText = "Ikke fylt ut av ansatt"
    const noneDescText = "Beskrivelse er ikke fylt ut av ansatt"
</script>

<Card title={title} saveFunc={saveFunc} cancelFunc={cancelFunc} backgroundColor={backgroundColor} disableInfoBox={disableInfoBox} editable={canEdit} infoBox={ {content: divCardHelp} } canSave={canSave} >
    {#if editInfo.isEditing && editInfo.editBlock === title}
        <div class="contentContainer">
            <div class="innerContainer firstContainer">
                <label for="jaaaaa">Hvis ja, utdyp hvilke oppgaver det gjelder</label><br>
                <div class="soloRadio">
                    <label for="ja">Ja</label>
                    <input type="radio" id="ja" name="solo" value="Ja" bind:group={tempOther.soloRole}>
                    <label for="nei">Nei</label>
                    <input type="radio" id="nei" name="solo" value="Nei" bind:group={tempOther.soloRole}>
                </div>
                {#if tempOther.soloRole === 'Ja'}
                    <div class="textareaContainer">
                        <label for="description">Beskriv hvilke oppgaver det gjelder (maks 200 tegn)</label><label for="description" class="validation">{!canSave ? '*' : '' }</label><br />
                        <textarea id="description" rows="7" maxlength="200" bind:value={tempOther.soloRoleDescription}/>
                        <!-- gjorde en liten endring her frem til vi validerer data, dette for å unngå at noen lagrere noe tomt og ikke får mulighet til å redigere igjen. -->
                        <span>{tempOther.soloRoleDescription?.length ?? 0}/200</span> 
                    </div>
                {/if}
            </div>
        </div>
    {:else}
        <div class="contentContainer">
            <div class="innerContainer firstContainer">
                <div>
                    <div><em id = "noneSolo"> </em></div>
                    <div><em id = "noneDesctription"> </em></div>
                    {#if !competence.other?.soloRole}
                        <div><em>{noneSoloText}</em></div>
                    {:else}
                        {competence.other.soloRole}
                    {/if}
                    {#if competence.other.soloRole === 'Ja'} 
                    - {competence.other.soloRoleDescription ?? noneDescText}
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</Card>

<style>
    .contentContainer {
        display: flex;
        flex-wrap: wrap;
        max-width: 50rem;
        justify-content: space-between;
    }
    .soloRadio {
        padding: 0.2rem;
    }
    label {
        font-size: 0.9em;
        font-weight: bold;
        font-style: italic;
    }

    input[type=radio] {
        margin: 5px 5px;
        display: inline-block;
        border: 1px solid var(--mork);
        border-radius: 0.5rem;
        box-sizing: border-box;
    }

    textarea {
        padding: 5px 5px;
        border: 1px solid var(--mork);
        border-radius: 0.5rem;
        resize: none;
        width: 100%;
    }

    .textareaContainer {
        width: 19rem;
    }

    .firstContainer {
        max-width: 25rem;
        padding-right: 2rem;
        padding-bottom: 2rem;
    }

</style>
