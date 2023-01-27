<script>
    import Chart from '../components/Chart.svelte';
    export let useOnlyUnitStats = false
    export let data = {
        allStats: [],
        onlyUnitStats: []
    }

    // Colors
	const colorVestfold = '#7ABED3'
	const colorTelemark = '#AD879E'

    const generateStats = (stats) => {
    // Generate stats for soloRole
    
    const countyStats = {
        noReply: 0,
        dunno: 0,
        telemark: 0,
        vestfold: 0,
        both: 0,
        notMandatory: 0
    }
    for (const org of stats) {
        const onlyMandatory = org.arbeidsforhold.filter(forhold => forhold.mandatoryCompetenceInput)
        
        countyStats.notMandatory += org.arbeidsforhold.filter(forhold => !forhold.mandatoryCompetenceInput).length
        countyStats.dunno += onlyMandatory.filter(forhold => forhold.perfCounty === 'Vet ikke').length
        countyStats.telemark += onlyMandatory.filter(forhold => forhold.perfCounty === 'Telemark fylkeskommune').length
        countyStats.vestfold += onlyMandatory.filter(forhold => forhold.perfCounty === 'Vestfold fylkeskommune').length
        countyStats.both += onlyMandatory.filter(forhold => forhold.perfCounty === 'Begge alternativene er like gode for meg').length
        countyStats.noReply += onlyMandatory.filter(forhold => !forhold.perfCounty).length
    }
    return {
        dataList: [countyStats.telemark, countyStats.vestfold],
        labels: [
            `Telemark (${countyStats.telemark})`,
            `Vestfold (${countyStats.vestfold})`,
        ]
    }
}

</script>

<div class="chartbox">
    <div class="pieChart">
        <Chart
            datasets={[{
                label: "Antall",
                data: useOnlyUnitStats ? generateStats(data.onlyUnitStats).dataList : generateStats(data.allStats).dataList,
                backgroundColor: [
                colorTelemark,
                colorVestfold
                ],
                hoverOffset: 4
            }]}
            labels={useOnlyUnitStats ? generateStats(data.onlyUnitStats).labels : generateStats(data.allStats).labels}
            title='Ønsket arbeidssted'
            type='pie'
            labelPos="bottom"
            titlePos="top"
            dataChange={useOnlyUnitStats}
        />
    </div>
</div>

<style>
    .chartbox {
        padding-top: 2rem;
    }

	.pieChart {
		margin-bottom: 15rem;
		margin-top: 2rem
	}
</style>