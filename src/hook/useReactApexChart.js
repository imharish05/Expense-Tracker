// Example modification for your hook
const useReactApexChart = (data = [], labels = []) => {
    const chartSeries = [
        {
            name: 'Payments Received',
            data: data
        }
    ];

    const chartOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3, colors: ['#487fff'] },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories: labels, // ["Jan", "Feb", ...]
        },
        yaxis: {
            labels: {
                formatter: (value) => `₹${value.toLocaleString('en-IN')}`
            }
        },
        colors: ['#487fff'],
    };

    return { chartOptions, chartSeries };
};

export default useReactApexChart;