<script>
    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';

    export let datasets
    export let labels
    export let title
    export let type
    export let labelPos
    export let titlePos

    // const data = datasets
    let config
    let chart
    const data = {
            labels: labels,
            datasets: datasets
        };

    if(type === 'pie') {
        config = {
            type: 'pie',
            data: data,
            options: {
                borderRadius: '10',
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
                    }
                }
            }
        }
    }

    if(type === 'stackedBar') {
        config = {
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
        }
    }

    onMount(()=> {
        const ctx = chart.getContext('2d');
        // Initialize chart using default config set
        var myChart = new Chart(ctx, config);
    })
</script>

<div class="chart">
    <canvas bind:this={chart}></canvas>
</div>

<style>
    .chart {
        width: 30rem;
        height: 30rem;
        margin-bottom: -12rem;
    }
</style>