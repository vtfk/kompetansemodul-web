<script>
    import DataTable, {Head, Body, Row, Cell}from '@smui/data-table'

    export let isCritical = true
    export let tableCritical = [
        {
            unitId: '000',
			unitCriticalData: [
                {
                    'Navn': 'Test',
                    'Har Kritisk Oppgave': 'Test',
                    'Beskrivelse': 'Test data test data',
                    'Dagens arbeidssted': 'Test',
                }
            ]
        }
    ]
    export let tableData = [
        {
            'Navn': 'Geir',
            'Kritisk Oppgave': 'Test data test data'
        },
        {
            'Navn': 'Jørgen',
            'Kritisk Oppgave': 'Test data test data'
        },
        {
            'Navn': 'Nils',
            'Kritisk Oppgave': 'Test data test data'
        },
        {
            'Navn': 'Jan Thomas',
            'Kritisk Oppgave': 'Test data test data'
        },
        {
            'Navn': 'Robin',
            'Kritisk Oppgave': 'Test data test data'
        }
    ]
    export let selected = []

    const addToSelected = (array) => {
        if(array !== undefined) {
            for(const row of array) {
                selected.push(row)
            }
        }
    }

    /*
		We use Object.entries to avoid getting the value if we used Object.keys - it's just easier. 
		Since b[k] may not exist, we use the short-circuit logical AND && operator - so if a key from a doesn't exist in b, it's not added to the result object. 
		Then we check if the two values are equal - if they are, then nothing needs to be added, but if they're not, we add the key and value from b to the result object. 
		In both cases, we return the result object.
	*/

    const getCriticalTasks = (a, b) => {
        if(a !== undefined && b !== undefined) {
            return Object.entries(a).reduce((ac, [k, v]) => b[k] && b[k] !== v ? (ac[k] = b[k], ac) : ac, [])
        } else {
            return []
        }
    }
    addToSelected(getCriticalTasks(tableData, tableCritical[0])) 

    
    const getChangeByKey = (a, b, attribute) => {
        if(a !== undefined && b !== undefined) {
            return a.filter(object1 =>  {
                return !b.some(object2 => {
                    return(eval(`object1. ${attribute} === object2. ${attribute}`))
                })
            })
        } else {
            return []
        }
    }   
    
</script>
{#if getCriticalTasks(tableData, tableCritical[0]).length !== 0}
    <div class="unitHeader flexMe">
        <h3>Evaluerte Kritiske oppgaver</h3>
    </div>
    <DataTable style="width: 100%; border:1px solid var(--noytral-3);">
        <Head>
            <Row>
            {#each Object.keys(tableData[0]) as columnName}
            <Cell style="width:100vw; border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{columnName}</Cell>
            {/each}
            <Cell style="width:100vw; border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">Er oppgaven Kritisk?</Cell>
            </Row>
        </Head>
        <Body>
            <!-- {console.log(getCriticalTasks(tableData, tableCritical[0]).length)} -->
            {#each getCriticalTasks(tableData, tableCritical[0]) as row}
                {#if isCritical}
                    <Row>
                        {#each Object.values(row) as cell}
                            {#if cell === null}
                                <Cell style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{''}</Cell>
                            {:else}
                                <Cell style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{cell}</Cell>
                            {/if}
                        {/each}
                        <Cell checkbox style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: center; padding: 8px;">
                            <div class="cell">
                                <p style="margin-right: 1rem;">Ja</p>
                                <input type="checkbox" bind:group={selected} value={row} />
                            </div>
                        </Cell>
                    </Row>
                {/if}
            {/each}
        </Body>
    </DataTable>
{/if}
{#if getChangeByKey(tableCritical[0], tableData, "Beskrivelse").length !== 0}
    <div class="unitHeader flexMe">
        <h3>Endringer i de kritiske oppgavene siden sist!</h3>
    </div>
    <DataTable style="width: 100%; border:1px solid var(--noytral-3);">
        <Head>
            <Row>
            {#each Object.keys(tableData[0]) as columnName}
            <Cell style="width:100vw; border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{columnName}</Cell>
            {/each}
            <Cell style="width:100vw; border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">Er oppgaven fortsatt Kritisk?</Cell>
            </Row>
        </Head>
        <Body>
            {#each getChangeByKey(getChangeByKey(tableCritical[0], tableData, "Beskrivelse"), tableData, "Beskrivelse") as row}
                {#if row['Har Kritisk Oppgave'] === 'Ja'}
                    <Row>
                        {#each Object.values(row) as cell}
                            {#if cell === null}
                                <Cell style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{''}</Cell>
                            {:else}
                                <Cell style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{cell}</Cell>
                            {/if}
                        {/each}
                        <Cell checkbox style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: center; padding: 8px;">
                            <div class="cell">
                                <p style="margin-right: 1rem;">Ja</p>
                                <input type="checkbox" bind:group={selected} value={row} /> 
                            </div>
                        </Cell>
                    </Row>
                {/if}
            {/each}
        </Body>
    </DataTable>
{/if}
{#if tableData.length !== 0 || getChangeByKey(tableCritical[0], tableData, "Navn").length !== 0}
    <!-- {#each getChangeByKey(tableCritical[0], tableData, "Navn") as row} -->
        <div class="unitHeader flexMe">
            <h3>Kritiske oppgaver som ikke er evaluert av leder</h3>
        </div>
        <DataTable style="width: 100%; border:1px solid var(--noytral-3);">
            <Head>
                <Row>
                {#each Object.keys(tableData[0]) as columnName}
                <Cell style="width:100vw; border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{columnName}</Cell>
                {/each}
                <Cell style="width:100vw; border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">Er oppgaven Kritisk?</Cell>
                </Row>
            </Head>
            <Body>
                <!-- {console.log(tableData)} -->
                {#if getChangeByKey(tableCritical[0], tableData, "Navn").length !== 0}
                    {#each getChangeByKey(tableCritical[0], tableData, "Navn") as row}
                        {#if row['Har Kritisk Oppgave'] === 'Ja'}
                        <Row>
                            {#each Object.values(row) as cell}
                                {#if cell === null}
                                    <Cell style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{''}</Cell>
                                {:else}
                                    <Cell style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{cell}</Cell>
                                {/if}
                            {/each}
                            <Cell checkbox style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: center; padding: 8px;">
                                <div class="cell">
                                    <p style="margin-right: 1rem;">Ja</p>
                                    <input type="checkbox" bind:group={selected} value={row} /> 
                                </div>
                            </Cell>
                        </Row>
                        {/if}
                    {/each}
                {:else}
                    {#each getChangeByKey(tableData, tableCritical[0], "Navn") as row}
                        {#if row['Har Kritisk Oppgave'] === 'Ja'}
                            <Row>
                                {#each Object.values(row) as cell}
                                    {#if cell === null}
                                        <Cell style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{''}</Cell>
                                    {:else}
                                        <Cell style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: left; padding: 8px;">{cell}</Cell>
                                    {/if}
                                {/each}
                                <Cell checkbox style="border-top: 1px solid var(--noytral-3); border-left: 1px solid var(--noytral-3); text-align: center; padding: 8px;">
                                    <div class="cell">
                                        <p style="margin-right: 1rem;">Ja</p>
                                        <input type="checkbox" bind:group={selected} value={row} /> 
                                    </div>
                                </Cell>
                            </Row>
                        {/if}
                    {/each}
                {/if}
            </Body>
        </DataTable>
{/if}

<style>
    .unitHeader {
		padding: 0 0 0.5rem 0;
		border-bottom: 1px solid var(--greyTone);
		margin-bottom: 1rem;
	}
	.unitHeader.flexMe {
		display: flex;
		justify-content: center;
		padding-top: 16px;
	}
    .cell {
        display: flex;
		justify-content: center;
    }
</style>