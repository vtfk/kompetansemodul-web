<script>
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
    
    export let isChecked = false
    export let selectedValue = null
    const callback = (id) => {
        let rows2 = document.querySelectorAll('tr')

        const table = document.getElementById('datatable')
        for(let i=0;i<table.children[1].childElementCount;i++) {
            const tableRow = table.children[1].children[i]
            console.log(tableRow)
            // for(var j=0;j<tableRow.childElementCount;j++) {
            //     var tableColumn = tableRow.children[j];
            //     console.log('Cell ['+i+','+j+'] value: '+tableColumn.innerHTML);
            // }
        }
        // const tbody = table.getElementsByTagName('tbody')
        // const rows = tbody.item(0).getElementsByTagName('tr')
        // // const cells = rows.item(0).getElementsByTagName('td')
        // // const test = [...cells]

        // const test2 = [...rows2]
        // test2.forEach(r => {
        //     const test3 = [...r.getElementsByTagName('td')]
        //     console.log(...test3)
        // });
        
        // test.forEach(r => {
        //     console.log(r)
        // });
    }
</script>

<table id="datatable">
    <thead>
        <tr>
            {#each Object.keys(tableData[0]) as columnName}
                <th>
                    {columnName}
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each Object.values(tableData) as row}
            <tr on:click={() => callback()}>
                {#each Object.values(row) as cell}
                    <td contenteditable="true" bind:innerHTML={cell} />
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
		border-collapse: collapse;
		width: 100%;
	}

	td, th {
		border: 1px solid var(--noytral-3);
		text-align: left;
		padding: 8px;
	}

	tr:nth-child(even) {
		background-color: var(--noytral-1);
	}
</style>