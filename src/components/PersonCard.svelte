<script>
    export let personData = {
        name: '',
        email: '',
        mainPosition: '',
        officeLocation: '',
    }
    export let extras = {}

    // $: { //
    //     const isChanged = newValue => console.log('Fra PersonCard:', newValue)
    //     isChanged(personData)
    // }
</script>

<div class="person-card">
    <div id="header"><h3>{personData.name}</h3></div>
    <div id="content">
        <p><strong>E-post:</strong> {personData.email}</p>
        <p><strong>Location:</strong> {personData.officeLocation}</p>
        <p><strong>Position:</strong> {personData.mainPosition}</p>
        {#each Object.keys(extras) as prop}
            <p><strong>{prop}:</strong> {personData[prop]}</p>
        {/each}
    </div>
</div>

<style>
    #header {
        border-bottom: 2px solid black;
    }
    .person-card {
        border: 2px solid black;
        border-radius: 2px;
        background-color: var(--potPourri);
        padding: 0px 5px;
        margin: 20px;
        text-align: left;
    }
</style>
