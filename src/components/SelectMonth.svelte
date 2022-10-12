<script>
    export let monthValue
    const months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']
</script>

<select bind:value={monthValue}>
    {#each months as month }
    <option value={month}>
        {month}
    </option>
    {/each}
</select>

<style>

</style>