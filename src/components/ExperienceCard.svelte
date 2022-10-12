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

<Card title="Annen relevant erfaring" editable={true} infoBox={ {content: "Her skriver du inn verv og sånn, det må være relevant"}} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div><strong>Erfaring</strong></div>
    <div>en liste med erfaring, verv. organisasjon, vervet, perioden</div>
</Card>

<style>

</style>