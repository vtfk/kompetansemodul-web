<script>
    import DataTable, {Head, Body, Row, Cell}from '@smui/data-table'

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
    let selected = [];
    
</script>
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
        {#each tableData as row}
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
                        <input type="checkbox"
                        bind:group={selected}
                        value={row}
                        />
                    </Cell>
                </Row>
            {/if}
        {/each}
    </Body>
</DataTable>

<pre>
    De som faktisk har kritiske oppgaver: {selected.map((tableData) => tableData.Navn).join(', ')}
</pre>

<style>
</style>