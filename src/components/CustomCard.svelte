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

<Card title="Robins kort" editable={true} infoBox={ {content: "Her kommer det du trenger hjelp til"}} saveFunc={saveFunc} cancelFunc={cancelFunc}>

</Card>

<style>

</style>