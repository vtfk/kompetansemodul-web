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

<select class="customSelect" bind:value={yearValue}>
    {#each years(startYear).years as year }
    <option value={year}>
        {year}
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