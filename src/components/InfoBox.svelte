<script>
    import IconClose from "./Icons/IconClose.svelte";
    // Props
    export let content = 'litt innhold og greier og geierojeirjdlkfjlksd '
    export let open = false
    export let onClose = () => {console.log('LUKK!')}


</script>

<div class="infoBox{ open ? ' open' : '' }">
    <div class="infoContainer">
        <div class="content">
            {content}
        </div>
        <div class="iconContainer">
            <div class="closeIcon" title="Lukk infoboks" on:click={onClose}><IconClose /></div>
        </div>
    </div>
</div>


<style>
    .infoBox {
        background-color: var(--siv-2);
        width: 100%;
        padding: 1rem;
        margin-bottom: 1rem;
        display: none;
    }
    .infoBox.open {
        display: block;
    }
    .closeIcon {
        width: 1rem;
        flex-shrink: 0;
        flex-wrap: nowrap;
    }
    .closeIcon:hover {
        transform: scale(1.2);
        cursor: pointer;
    }
    .iconContainer {
        display: flex;
        align-items: center;
        height: 1rem;
    }
    .infoContainer {
        display: flex;
        justify-content: space-between;
    }

</style>