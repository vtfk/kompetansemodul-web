<script>
    export let monthValue
    const months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']

</script>

<select class="customSelect" bind:value={monthValue}>
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
</style>
