<script>
    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';

    export let datasets
    export let labels
    export let title
    export let type
    export let labelPos
    export let titlePos
    export let dataChange = false

   
    let chart
    let ctx

    console.log(datasets)

    const data = {
            labels: labels,
            datasets: datasets
        };
    
    
    $: if (chart){
        chart.data = data
        chart.update()
    }


    // if(type === 'pie') {
    //     config = {
    //         type: 'pie',
    //         data: data,
    //         options: {
    //             borderRadius: '10',
    //             responsive: true,
    //             cutout: '1%',
    //             spacing: 1,
    //             plugins: {
    //                 legend: {
    //                     position: labelPos,
    //                     display: true,
    //                     labels: {
    //                         usePointStyle: true,
    //                         padding: 20,
    //                         font: {
    //                             size: 14
    //                         }
    //                     }
    //                 },
    //                 title: {
    //                     display: true,
    //                     text: title,
    //                     position: titlePos
    //                 }
    //             }
    //         }
    //     }
    // }

    // if(type === 'stackedBar') {
    //     config = {
    //         type: 'bar',
    //         data: data,
    //         options: {
    //             indexAxis: 'y',
    //             elements: {
    //                 bar: {
    //                     borderWidth: 2,
    //                 }
    //             },
    //             responsive: true,
    //             scales: {
    //                 x: {
    //                     display:false,
    //                     stacked: true,
    //                 },
    //                 y: {
    //                     display: false,
    //                     stacked: true
    //                 },
                    
    //             },
    //             plugins: {
    //                 legend: {
    //                     position: labelPos,
    //                 },
    //                 title: {
    //                     display: true,
    //                     text: title,
    //                     position: titlePos
    //                 }
    //             }
    //         }
    //     }
    // }

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
                        }
                    }
                }
            });
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
    <p>{title}</p>
</div>

<style>
    .chart {
        width: 30rem;
        height: 30rem;
        margin-bottom: -12rem;
    }
</style>