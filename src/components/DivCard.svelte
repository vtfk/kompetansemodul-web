<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'

    // Props
    export let title = 'Annen relevant informasjon'
    export let backgroundColor = '--ecruWhite'
    export let competence = {
		other: {}
	}

    if (!competence.other) competence.other = {}

    // Store
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // State
    let tempOther = JSON.parse(JSON.stringify(competence.other)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    
    // Validation
    let canSave = false

    // Reactive validation
    $: {
        canSave = (tempOther.soloRole === 'Nei') || (tempOther.soloRoleDescription && tempOther.soloRoleDescription.length > 0)
    }

    // Functions
    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, other: tempOther})
            competence.other = JSON.parse(JSON.stringify(tempOther))
        } else {
            console.log('Ingen endring, gidder ikke lagre')
        }
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.other) !== JSON.stringify(tempOther)) return true
        return false
    }

    const cancelFunc = async () => {
        tempOther = JSON.parse(JSON.stringify(competence.other))
    }

    const infoText = "<h4>Til slutt trenger vi litt annen informasjon fra deg.</h4><br><p>Du har en solorolle dersom dine arbeidsoppgaver og/eller fagfelt er unikt innenfor din sektor og at du alene har en nøkkelfunksjon som andre er avhengige. Et eksempel: Kari er den eneste i BDK som har funksjonen som programmerer av verktøyet PowerBI som er viktig i mange utviklingsområder.</p><br><p>Vi ber også om at du tar stilling til foretrukken fylkeskommune. Her ønsker vi at du svarer på hvilken fylkeskommune du foretrekker (Telemark eller Vestfold). Du kan også trykke “vet ikke” om du ikke har bestemt deg eller om ønsket ditt er avhengig av andre rammebetingelser.</p><br><p>MERK: Ditt svar er ikke bindende og er kun ment for at arbeidsgiver skal få en oversikt over hva de ansatte ønsker. Det betyr at ditt svar ikke automatisk vil få følger for innplasseringen. </p>"
</script>

<Card title={title} saveFunc={saveFunc} cancelFunc={cancelFunc} backgroundColor={backgroundColor} editable={true} infoBox={ {content: infoText} } canSave={canSave} >
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
        <div class="contentContainer">
            <div class="innerContainer firstContainer">
                <h4>Solorolle</h4>
                <div class="soloRadio">
                    <label for="ja">Ja</label>
                    <input type="radio" id="ja" name="solo" value="Ja" bind:group={tempOther.soloRole}>
                    <label for="nei">Nei</label>
                    <input type="radio" id="nei" name="solo" value="Nei" bind:group={tempOther.soloRole}>
                </div>
                {#if tempOther.soloRole === 'Ja'}
                    <div class="textareaContainer">
                        <label for="description">Beskriv din solorolle (maks 200 tegn)</label><label for="description" class="validation">{!canSave ? '*' : '' }</label><br />
                        <textarea id="description" rows="6" maxlength="200" bind:value={tempOther.soloRoleDescription}/>
                        <!-- gjorde en liten endring her frem til vi validerer data, dette for å unngå at noen lagrere noe tomt og ikke får mulighet til å redigere igjen. -->
                        <span>{tempOther.soloRoleDescription?.length ?? 0}/200</span> 
                    </div>
                {/if}
            </div>
            <div class="innerContainer">
                <h4>Ønsket fylkeskommune/arbeidssted etter oppdeling</h4>
                <select name="preferredCounty" id="preferredCounty" bind:value={tempOther.preferredCounty}>
                    <option value="Vet ikke">Vet ikke</option>
                    <option value="Telemark fylkeskommune">Telemark fylkeskommune</option>
                    <option value="Vestfold fylkeskommune">Vestfold fylkeskommune</option>
                </select>
            </div>
        </div>
        {:else}
            <div class="contentContainer">
                <div class="innerContainer firstContainer">
                    <h4>Solorolle</h4>
                    <div>{competence.other?.soloRole || 'Ikke fylt ut av ansatt'}
                        {#if competence.other.soloRole === 'Ja'}
                            - {competence.other.soloRoleDescription}
                        {/if}
                    </div>
                </div>
                <div class="innerContainer">
                    <h4>Ønsket fylkeskommune/arbeidssted etter oppdeling</h4>
                    <div>{competence.other.preferredCounty || 'Ikke fylt ut av ansatt'}</div>
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

    select {
        width: 100%;
        padding: 5px 5px;
        border: 1px solid var(--mork);
        border-radius: 0.5rem;
        box-sizing: border-box;
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
    .validation {
        color: var(--red)
    }

</style>