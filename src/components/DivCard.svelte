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

<Card title="Litt annet" editable={true} infoBox={ {content: "Her skriver du inn noe"}} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div><strong>Soloroller?</strong></div>
    <div>Nei, alle kan det</div>
    <div><strong>Foretrukken fk</strong></div>
    <div>Nordland</div>
    <div><strong>Tidligere Plassering</strong></div>
    <div>Telemark, Vestfold, kun VTFK</div>
</Card>

<style>

</style>