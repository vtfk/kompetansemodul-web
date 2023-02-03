<script>
    import Chart, { Colors, controllers } from 'chart.js/auto';
    import { onMount } from 'svelte';
    import ChartDataLabels from 'chartjs-plugin-datalabels';

    export let datasets
    export let labels
    export let title
    export let type
    export let labelPos
    export let titlePos
    export let dataChange
    export let disabled = []

   
    let chart
    let ctx
    let total = 0

    Chart.register(ChartDataLabels)

    const data = {
        labels: labels,
        datasets: datasets,
    }

    $: if((dataChange == true && chart) || (dataChange == false && chart)) {
        if(type === 'pie') {
            chart.data.labels = labels
            chart.data.datasets[0].data = datasets[0].data
            chart.update()
        }
        if (type === 'stackedBar') {
            chart.data.datasets = datasets
            chart.update()
        }
    }   
    // Plugins
    const noDataStackedBar = {
        id: 'noDataStackedBar',
        beforeDraw: (chart) => {
            const {ctx} = chart
            const width = ctx.canvas.width
            const height = ctx.canvas.height
            let data = []
            for (let i = 0; i < chart.data.datasets.length; i++) {
                data.push(chart.data.datasets[i].data[0])
            }
            if(data.reduce((a, b) => a + b, 0) === 0) {
                ctx.font = "22px Nunito Sans"
                ctx.fillStyle = 'grey'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText('Ingen data', width/2, height/1.5)
                ctx.restore()
            }
        }
    }

    const noDataPieChart = {
        id: 'noDataPieChart',
        beforeDraw: (chart) => {
            const {ctx} = chart
            const width = ctx.canvas.width
            const height = ctx.canvas.height
            chart.data.datasets.forEach(chart => {
                if(chart.data.reduce((a, b) => a + b, 0) === 0) {
                    ctx.font = "22px Nunito Sans"
                    ctx.fillStyle = 'grey'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillText('Ingen data', width/2, height/2)
                    ctx.restore()
                }
            })
        }
    }

    onMount(async ()=> {
        // Initialize chart using default config set
        if(type === 'pie') {
            chart = new Chart(ctx, {
                type: 'pie',
                data: data,
                options: {
                    responsive: true,
                    cutout: '1%',
                    spacing: 1,
                    plugins: {
                        datalabels: {
                            labels: {
                               index: {
                                align: 'center',
                                color: 'black',
                                backgroundColor: 'white',
                                borderColor: 'white',
                                borderRadius: 5, 
                                borderWidth: 1
                               }
                            },
                            font: {
                                size: 15,
                            },
                            // Returns percentage value of the pie based of the total value of all the pies present in the piechart.
                            formatter: (value, context) => {
                                const datapoints = context.chart.data.datasets[0].data
                                function sumArray(total, datapoint) {
                                    return total + datapoint
                                }
                                const totalValue = datapoints.reduce(sumArray, 0)
                                const percentageValue = (value / totalValue * 100).toFixed(1)
                                
                                return `${percentageValue}%`
                            },
                            // Boolean value (display: true/false)
                            display: function(context) {
                                return context.dataset.data[context.dataIndex] !== 0   
                            }    
                        },
                        legend: {
                            position: labelPos,
                            display: true,
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 14
                                }
                            },
                            
                        },
                        title: {
                            display: true,
                            text: title,
                            position: titlePos,
                            font: {
                                size: 20
                            }
                        },
                    },
                },
                plugins: [noDataPieChart]
            })
            for (const disableIndex of disabled) {
                chart.toggleDataVisibility(disableIndex)
                chart.update()
            }
        }
        if(type === 'stackedBar') {
            chart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    indexAxis: 'y',
                    elements: {
                        bar: {
                            borderWidth: 2,
                        }
                    },
                    responsive: true,
                    scales: {
                        x: {
                            display:false,
                            stacked: true,
                        },
                        y: {
                            display: false,
                            stacked: true,
                        }
                    },
                    plugins: {
                        datalabels: {
                            labels: {
                               index: {
                                align: 'center',
                                color: 'black',
                                anchor: 'center',
                                clamp: true,
                                backgroundColor: 'white',
                                borderColor: 'white',
                                borderRadius: 5, 
                                borderWidth: 1
                               }
                            },
                            font: {
                                size: 15,
                            },
                            // Returns percentage value of the bar based of the total value of all the bars present in the stackedbar chart.
                            formatter: (value, context) => {
                                total = 0
                                for (let i = 0; i < context.chart.data.datasets.length; i++) {
                                    const datapoints = context.chart.data.datasets[i].data
                                    function sumArray(total, datapoint) {
                                        return total + datapoint 
                                    }
                                    const totalValue = datapoints.reduce(sumArray, 0)
                                    total += totalValue
                                }
                                const percentageValue = (value / total * 100)   
                                return `${percentageValue.toFixed(1)}%`
                            },
                            // Boolean value (display: true/false), shows the labels if true.
                            display: function(context) {
                                const value = context.dataset.data[context.dataIndex]
                                const percentage = (Number(value) / total * 100)
                                
                                // Hide labels if the percentage value is less than 10%
                                if(percentage < 10) {
                                    return false
                                } else {
                                    return true
                                    // return context.dataset.data[context.dataIndex] !== 0
                                }
                                   
                            }         
                        },
                        legend: {
                            position: labelPos,
                        },
                        title: {
                            display: true,
                            text: title,
                            position: titlePos,
                            font: {
                                size: 20
                            }
                        }
                    },
                },
                plugins: [noDataStackedBar]
            })
        } 
    })
    
</script>

<div class="chart">
    <canvas id="chart" bind:this={ctx}></canvas>
</div>

<style>
    .chart {
        width: 30rem;
        height: 30rem;
        margin-bottom: -12rem;
    }
</style>