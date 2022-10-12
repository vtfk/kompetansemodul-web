<script>
    import Card from "./Card.svelte";

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

<Card title="Oppgaver" editable={true} infoBox={ {content: "Her skriver du inn oppgavene du driver med I STIKKORDSFORM"}} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div><strong>Knyttet til min hovedstilling</strong></div>
    <div>Jeg driver med ditt og datt, men bidrar ikke stort</div>
    <div><strong>Andre oppgaver</strong></div>
    <div>Jeg driver med ditt og datt, men bidrar ikke stort</div>
</Card>

<style>

</style>