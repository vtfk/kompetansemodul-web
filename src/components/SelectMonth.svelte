<script>
    export let monthValue
    export let validation = false
    export let validated = false
    
    const months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']

</script>

<select class="customSelect{(validation && !validated) ? ' required' : ''}" bind:value={monthValue}>
    {#each months as month }
    <option value={month}>
        {month}
    </option>
    {/each}
</select>

<style>
.customSelect {
    margin-bottom: 0.5rem;
    display: inline-block;
}

.customSelect.required {
    border-width: 2px;
    border-color: var(--red)
}
</style>
