<script>
    export const title = "Balle Frans Ferdinand"
    export const personData = {
        mainPosition: "Murer",
        officeLocation: "Horten kirkegård",
        
    }

</script>

<div class="card">
    <div id="header"><h3>{title}</h3></div>
    <div id="content">
        {#each Object.keys(personData) as prop}
            <p>{prop}: {personData[prop]}</p>
        {/each}
    </div>
</div>

<style>
    #header {
        border-bottom: 2px solid black;
    }
    .card {
        border: 2px solid black;
        border-radius: 2px;
        background-color: var(--potPourri);
        padding: 0px;
        margin: 20px;
        text-align: left;
    }
</style>