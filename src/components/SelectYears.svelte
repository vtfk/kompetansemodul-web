<script>
    export let yearValue
    export let startYear = undefined
    export let validation = false
    export let validated = false
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

<select class="customSelect{(validation && !validated) ? ' required' : ''}" bind:value={yearValue}>
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

.customSelect.required {
    border-width: 2px;
    border-color: var(--red)
}
</style>
