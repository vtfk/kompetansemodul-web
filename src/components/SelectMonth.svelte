<script>
    export let monthValue
    export let validation = false
    export let validated = false
    export let fromMonth = undefined
    
    const months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']

    const restrictList = (fromMonth) => {
        const monthsToRestrict = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']
        return monthsToRestrict.splice(monthsToRestrict.findIndex(i => i === fromMonth))
    }

</script>

<select class="customSelect{(validation && !validated) ? ' required' : ''}" bind:value={monthValue}>
    {#if fromMonth === undefined}
        {#each months as month }
        <option value={month}>
            {month}
        </option>
        {/each}
    {:else}
        {#each restrictList(fromMonth) as month}
            <option value={month}>
                {month}
            </option>
        {/each}
    {/if}
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
