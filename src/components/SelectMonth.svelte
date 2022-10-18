<script>
    export let monthValue
    export let addTodaysDate = false
    const months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']
    const monthsActive = ['Dagens dato', 'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']

</script>

<select class="customSelect" bind:value={monthValue}>
    {#each (addTodaysDate ? monthsActive : months) as month }
    <option value={month}>
        {month}
    </option>
    {/each}
</select>

<style>
.customSelect {
    width: 100%;
    padding: 5px 5px;
    margin-bottom: 0.5rem;
    display: inline-block;
    border: 1px solid var(--mork);
    border-radius: 0.5rem;
    box-sizing: border-box;
}
</style>