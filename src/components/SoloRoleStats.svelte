<script>
    import { getLabel } from '../lib/Helpers/generateLabel';
    import Chart from '../components/Chart.svelte';

    export let useOnlyUnitStats = false
    export let data = {
        allStats: [],
        onlyUnitStats: []
    }

    // Colors
	const colorTelemark = '#AD879E'
	const colorNoReply = '#EB8380'
	const colorSame = '#90BC7F'
	const colorNotMandatory = '#E3E3E3'

    const generateStats = (stats) => {
        // Generate stats for soloRole
        const soloRoleStats = {
            noReply: 0,
            yes: 0,
            no: 0,
            notMandatory: 0
        }
        for (const org of stats) {
            const onlyMandatory = org.arbeidsforhold.filter(forhold => forhold.mandatoryCompetenceInput)
            // soloRoleStats.notMandatory += org.arbeidsforhold.filter(forhold => !forhold.mandatoryCompetenceInput).length
            // soloRoleStats.noReply += onlyMandatory.filter(forhold => !forhold.soloRole).length
            soloRoleStats.yes += onlyMandatory.filter(forhold => forhold.soloRole === 'Ja').length
            soloRoleStats.no += onlyMandatory.filter(forhold => forhold.soloRole === 'Nei').length
        }
        const total = soloRoleStats.yes + soloRoleStats.no
        const percentage = 10
        return {
            dataList: [soloRoleStats.no, soloRoleStats.yes, soloRoleStats.noReply, soloRoleStats.notMandatory],
            labels: [
                getLabel(total, percentage, 'Har svart nei', soloRoleStats.no),
                getLabel(total, percentage, 'Har svart ja', soloRoleStats.yes),
                // `Har ikke svart (${soloRoleStats.noReply})`,
                // `Skal ikke svare (${soloRoleStats.notMandatory})`,
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
                colorSame,
                // colorNoReply,
                // colorNotMandatory
                ],
                hoverOffset: 4
            }]}
            labels={useOnlyUnitStats ? generateStats(data.onlyUnitStats).labels : generateStats(data.allStats).labels}
            title='Andel ansatte som har svart at de er den eneste med sin stilling og/eller ansvarsområde i enheten'
            type='pie'
            labelPos="bottom"
            titlePos="top"
            dataChange={useOnlyUnitStats}
            disabled={[3,2]}
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