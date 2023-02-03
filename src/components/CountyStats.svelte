<script>
    import Chart from './Chart.svelte';
    import { getLabel } from '../lib/Helpers/generateLabel';

    export let useOnlyUnitStats = false
    export let data = {
        allStats: [],
        onlyUnitStats: []
    }

    // Colors
	const colorVestfold = '#7ABED3'
	const colorTelemark = '#AD879E'
	const colorNoReply = '#EB8380'
	const colorSame = '#90BC7F'
	const colorDunno = '#F0E1BD'
	const colorOther = '#D1AB94'

    const generateStats = (stats) => {
        // Generate stats for soloRole
        const officeStats = {
            vestfold: 0,
            telemark: 0,
            other: 0,
            notMandatory: 0
        }
        const countyStats = {
            noReply: 0,
            dunno: 0,
            telemark: 0,
            vestfold: 0,
            both: 0,
            notMandatory: 0
        }
    
        const filterVestfoldVGS = ['Greveskogen vgs', 'Re vgs', 'Holmestrand vgs', 'Horten vgs', 'Sande vgs', 'Færder vgs', 'Sandefjord vgs', 'Thor Heyerdahl vgs', 'Melsom vgs']
        const filterTelemarkVGS = ['Nome vgs avd Lunde', 'Notodden vgs', 'Vest-Telemark vgs avd Dalen', 'Bø vgs',' Nome vgs avd Søve', 'Rjukan vgs', 'Kragerø vgs', 'Porsgrunn vgs', 'Skogmo vgs', 'Bamble vgs avd Croftholmen', 'Hjalmar Johansen vgs', 'Skien vgs', 'Bamble vgs avd Grasmyr']
        const filterTelemarkFagskole = ['Fagskolen VT - Porsgrunn']
        const filterTelemarkFylkeshus = ['Fylkessenter Seljord', 'Fylkeshuset T18 Skien', 'Fylkeshuset T18 Skien']
        const filterVestfoldFylkeshus = ['Fylkeshuset i Tønsberg']

        const filterVestFold = filterVestfoldFylkeshus.concat(filterVestfoldVGS)
        const filterTelemark = filterTelemarkFylkeshus.concat(filterTelemarkFagskole, filterTelemarkVGS)
        const filterOther = filterVestFold.concat(filterTelemark)

        for (const org of stats) {
            const onlyMandatory = org.arbeidsforhold.filter(forhold => forhold.mandatoryCompetenceInput)
            
            officeStats.notMandatory += org.arbeidsforhold.filter(forhold => !forhold.mandatoryCompetenceInput).length
            officeStats.vestfold += onlyMandatory.filter(forhold => filterVestFold.includes(forhold.officeLocation)).length
            officeStats.telemark += onlyMandatory.filter(forhold => filterTelemark.includes(forhold.officeLocation)).length
            officeStats.other += onlyMandatory.filter(forhold => !filterOther.includes(forhold.officeLocation)).length

            countyStats.notMandatory += org.arbeidsforhold.filter(forhold => !forhold.mandatoryCompetenceInput).length
            countyStats.dunno += onlyMandatory.filter(forhold => forhold.perfCounty === 'Vet ikke').length
            countyStats.telemark += onlyMandatory.filter(forhold => forhold.perfCounty === 'Telemark fylkeskommune').length
            countyStats.vestfold += onlyMandatory.filter(forhold => forhold.perfCounty === 'Vestfold fylkeskommune').length
            countyStats.both += onlyMandatory.filter(forhold => forhold.perfCounty === 'Begge alternativene er like gode for meg').length
            countyStats.noReply += onlyMandatory.filter(forhold => !forhold.perfCounty).length
        }

        const totalCounty = countyStats.vestfold + countyStats.dunno + countyStats.both + countyStats.telemark
        const totalOffice = officeStats.vestfold + officeStats.telemark
        const percentage = 10
        return {
            // Shows which office location the employee would prefere 
            county: [
                {
                    label: getLabel(totalCounty, percentage, 'Vestfold', countyStats.vestfold),
                    barThickness:100,
                    data: [countyStats.vestfold],
                    backgroundColor: [
                        colorVestfold,
                    ],
                    hoverOffset:4
                },
                {
                    label: getLabel(totalCounty, percentage, 'Vet ikke', countyStats.dunno),
                    barThickness:100,
                    data: [countyStats.dunno],
                    backgroundColor: [
                        colorDunno
                    ],
                    hoverOffset:4
                },
                {
                    label: getLabel(totalCounty, percentage, 'Fleksibel', countyStats.both),
                    barThickness:100,
                    data: [countyStats.both],
                    backgroundColor: [
                        colorSame
                    ],
                    hoverOffset:4
                },
                // {
                //     label: `Har ikke svart (${countyStats.noReply})`,
                //     barThickness:100,
                //     data: [countyStats.noReply],
                //     backgroundColor: [
                //         colorNoReply
                //     ],
                //     hoverOffset:4,
                //     hidden: true
                // },
                {
                    label: getLabel(totalCounty, percentage, 'Telemark', countyStats.telemark),
                    barThickness:100,
                    data: [countyStats.telemark],
                    backgroundColor: [
                        colorTelemark
                    ],
                    hoverOffset:4
                }
            ],
            //Shows current office location
            office: [
                {
                    label: getLabel(totalOffice, percentage, 'Vestfold', officeStats.vestfold),
                    barThickness:100,
                    data: [officeStats.vestfold],
                    backgroundColor: [
                        colorVestfold,
                    ],
                    hoverOffset:4
                },
                {
                    label: getLabel(totalOffice, percentage, 'Telemark', officeStats.telemark),
                    barThickness:100,
                    data: [officeStats.telemark],
                    backgroundColor: [
                        colorTelemark
                    ],
                    hoverOffset:4
                },
                // {
                //     label: `Annen lokasjon enn et fylkeshus (${officeStats.other})`,
                //     barThickness:100,
                //     data: [officeStats.other],
                //     backgroundColor: [
                //         colorOther
                //     ],
                //     hoverOffset:4,
                //     hidden: true
                // }
            ]
        }
    }

</script>

<div class="chartbox">
    <div class="stackedBarTop">
        <Chart
            datasets={useOnlyUnitStats ? generateStats(data.onlyUnitStats).county : generateStats(data.allStats).county}
            labels={[
                ''
            ]}
            title="Ønsket arbeidssted"
            type="stackedBar"
            labelPos="top"
            titlePos="top"
            dataChange={useOnlyUnitStats}
        />
    </div>
    <div class="stackedBarBottom">
        <Chart
            datasets={useOnlyUnitStats ? generateStats(data.onlyUnitStats).office : generateStats(data.allStats).office}
            labels={[
                ''
            ]}
            title="Dagens arbeidssted"
            type="stackedBar"
            labelPos="top"
            titlePos="top"
            dataChange={useOnlyUnitStats}
        />
    </div>
</div>

<style>
    .chartbox {
        padding-top: 2rem;
    }

	.stackedBarBottom {
		margin-top: -16rem;
	}

	.stackedBarTop {
		padding-top: 2rem;
	}
</style>