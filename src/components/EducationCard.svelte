<script>
    import { each } from "svelte/internal";

    export let title = 'Utdanning'
    export let backgroundColor = '--ecruWhite'
    export let education = []

    let isEditing = false
</script>

<div class="panel" style="background-color: var({backgroundColor});">
    <div class="header">
        <h3 class="title">{title}</h3>
        {#if isEditing}
            <div>
                <button on:click={() => isEditing = false}>Avbryt redigering</button>
                <button>Lagre</button>
            </div>
        {:else}
            <button on:click={() => isEditing = true}>Rediger</button>
        {/if}
    </div>
    <div id="content">
        <ul>
            {#each education as edu}
                <li>
                    {edu.degree ?? 'Ukjent grad'} - {edu.subject ?? 'Ukjent fag'} - {edu.yearSpan ?? 'Ukjent start-år'} - {edu.school ?? 'Ukjent skole'}
                </li>
            {/each}
        </ul>
        {#if isEditing}
            <div>
                <button class='addButton' on:click={() => {}}>Legg til ny utdanning</button>
            </div>
        {/if}
    </div>
</div>

<style>
    .header {
        display: flex;
        justify-content: space-between;
    }
    .panel {
        margin-bottom: 32px;
        padding: 40px 32px;
    }
    .title {
        margin: 0 0 16px 0;
    }
    button {
        padding: 4px;
        margin-bottom: 16px;
    }
    button:hover {
        cursor: pointer;
        background-color: var(--catSkillWhite);
    }
    .addButton {
        margin-top: 16px;
    }
</style>
