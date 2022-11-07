<script>
    export let yearValue
    export let startYear = undefined
    export let expandYear = 0
    
    const years = (startYear) => {
        const currentYear = new Date().getFullYear()
        let yearArr = []
        for (let i = startYear; i <= currentYear + expandYear; i++){
            yearArr.push(i)
        }
        return {
            years: yearArr.reverse(),
            currentYear
        }
    }
</script>

<select class="customSelect" bind:value={yearValue}>
    {#each years(startYear).years as year }
    <option value={year}>
        {year}
    </option>
    {/each}
</select>

<style>
.customSelect {
        margin-bottom: 0.5rem;
        display: inline-block;
    }
</style>
