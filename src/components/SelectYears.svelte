<script>
    export let yearValue
    export let startYear = undefined
    
    const years = (startYear) => {
        const currentYear = new Date().getFullYear()
        let yearArr = []
        for (let i = startYear; i <= currentYear; i++){
            yearArr.push(i)
        } 
        return {
            years: yearArr.reverse(),
            currentYear
        }
    }
</script>

<select bind:value={yearValue}>
    {#each years(startYear).years as year }
    <option value={year}>
        {year}
    </option>
    {/each}
</select>

<style>

</style>