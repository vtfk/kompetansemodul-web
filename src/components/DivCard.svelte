<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import InnerCard from "./InnerCard.svelte"

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
    
    const saveFunc = async () => {
        console.log(tempOther)
        if (checkIfChanges()) {
            console.log(await saveCompetence({...competence, other: tempOther}))
            competence.other = JSON.parse(JSON.stringify(tempOther))
        } else {
            console.log('Ingen endring, gidder ikke lagre')
        }
	}

    const checkIfChanges = () => {
        if ((competence.other) !== (tempOther)) return true
        return false
    }

    const cancelFunc = async () => {
        tempOther = JSON.parse(JSON.stringify(competence.other))
    }
</script>

<Card title={title} saveFunc={saveFunc} cancelFunc={cancelFunc} backgroundColor={backgroundColor} editable={true} infoBox={ {content: "Her skriver du inn noe"}}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
        <div class="contentConteiner">
            <div class="soloContainer">
                <form name="soloroleForm">
                    <label for="solorole">Solorolle</label><br>
                    <div class="soloRadio">
                        <label for="ja">Ja</label>
                        <input type="radio" id="solorole" name="solo" value="Ja" bind:group={tempOther.soloRole}>
                        <label for="nei">Nei</label>
                        <input type="radio" id="solorole" name="solo" value="Nei" bind:group={tempOther.soloRole}>
                    </div>
                    {#if tempOther.soloRole === 'Ja'}
                        <div class="textareaContainer">
                            <label for="description">Beskriv din solorolle</label>
                            <textarea id="description" rows="4" cols="50" maxlength="200" bind:value={tempOther.description}/>
                        </div>
                    {/if}
                    <label for="solorole">Foretrukken fylkeskommune</label><br>
                    <select name="degree" id="degree" bind:value={tempOther.county}>
                        <option value="Telemark">Telemark</option>
                        <option value="Vestfold">Vestfold</option>
                        <option value="Vet ikke">Vet ikke</option>
                    </select>
                </form>
            </div>
        </div>
        {:else}
            <div class="contentConteiner">
                <label for="solorole">Solorolle</label><br>
                <div>{tempOther.soloRole || 'Har ikke oppdatert denne informasjonen'}</div>
                {#if competence.other.soloRole === 'Ja'}
                    <div class="textareaContainer">
                        <label for="description">Beskriv din solorolle</label>
                        <textarea id="description" disabled rows="4" cols="50" maxlength="200" bind:value={competence.other.description}/>
                    </div>
                {/if}
            </div>
            <div>
                <label for="solorole">Foretrukken fylkeskommune</label><br>
                <div>{tempOther.county || 'Har ikke oppdatert denne inromasjonen'}</div>
            </div>
        {/if}
</Card>

<style>
.soloRadio {
    padding: 0.2rem;
}

.contentConteiner {
    width: 23rem;
}

.soloContainer {
    display: flex;
}

label {
    font-size: 0.9em;
    font-weight: bold;
    font-style: italic;
}

select {
    width: 100%;
    padding: 5px 5px;
    display: inline-block;
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
    display: inline-block;
    border: 1px solid var(--mork);
    border-radius: 0.5rem;
    box-sizing: border-box;
}

.textareaContainer {
    display:grid;
}
</style>