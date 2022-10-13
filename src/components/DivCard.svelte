<script>
    import Card from "./Card.svelte";
    import { get } from 'svelte/store'
    // import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    
    // State
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    // Props
    export let title = 'Litt annet'
    export let backgroundColor = '--ecruWhite'

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    
    const saveFunc = async () => {
        await sleep(1000)
        const res = Math.floor(Math.random() * 2)+1
        if (res === 1) console.log('OK, lagret')
        else throw new Error('ÅNEI!')
    }
    const cancelFunc = async () => {
        console.log('ok, slutta å redigere')
    }
</script>

<Card title={title} backgroundColor={backgroundColor} editable={true} infoBox={ {content: "Her skriver du inn noe"}} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            <div class="soloContainer">
                <form name="soloroleForm">
                    <label for="solorole">Solorolle</label><br>
                    <div class="soloRadio">
                        <label for="ja">Ja</label>
                        <input type="radio" id="solorole" name="solo" value="ja">
                    </div>
                    <div class="soloRadio">
                        <label for="nei">Nei</label>
                        <input type="radio" id="solorole" name="solo" value="nei">
                    </div>
                </form>
            </div>

        {:else}
            <div><strong>Soloroller</strong></div>
            <div>Nei, alle kan det</div>
            <div><strong>Foretrukken fk</strong></div>
            <div>Nordland</div>
            <div><strong>Tidligere Plassering</strong></div>
            <div>Telemark, Vestfold, kun VTFK</div>
        {/if}
</Card>

<style>
label {
    font-size: 0.9em;
    font-weight: bold;
    font-style: italic;
}

.soloRadio {
    padding: 0.2rem;
}

.soloContainer {
    display: flex;
}
</style>