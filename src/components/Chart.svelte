<script>
    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';

    export let datasets
    export let labels
    export let title
    export let type
    export let labelPos
    export let titlePos
    export let dataChange

   
    let chart
    let ctx

    const data = {
        labels: labels,
        datasets: datasets,
    }
    console.log(datasets)
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

    Chart.register({
        id: 'custom_canvas_background_if_no_data',
        beforeDraw: (chart) => {
            const {ctx} = chart;
            ctx.save();
            ctx.font = '22px, Arial';
            ctx.fillStyle = 'grey';
            ctx.fillText('Ingen data', chart.chartArea.width, chart.chartArea.height);
            ctx.restore();
        }
    })

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
                        legend: {
                            position: labelPos,
                            display: true,
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 14
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: title,
                            position: titlePos
                        },
                    }
                }
            });
            // Lag en foreach som tar et array og setter de til visible/hidden. Trenger en prop som heter noe lurt og ekponeres i chart.
            // chart.toggleDataVisibility(0)
            // chart.update();
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
                            stacked: true
                        },
                        
                    },
                    plugins: {
                        legend: {
                            position: labelPos,
                        },
                        title: {
                            display: true,
                            text: title,
                            position: titlePos
                        }
                    }
                }
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