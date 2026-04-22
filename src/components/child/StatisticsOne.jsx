import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import useReactApexChart from '../../hook/useReactApexChart'
import ReactApexChart from 'react-apexcharts'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const StatisticsOne = () => {
    // 1. Get the total collected amount from Redux
    const { totalCollected = 0 } = useSelector((state) => state.stages);
    const { projects = [] } = useSelector((state) => state.projects);

    // 2. Mock data for the chart (or replace with real monthly data if available)
    // For now, we'll use the totalCollected as a data point
    const chartData = [totalCollected]; 
    const chartLabels = ["Total Revenue"];


    // 3. Initialize the hook with data
    const { chartOptions, chartSeries } = useReactApexChart(chartData, chartLabels);

    return (
        <div className="col-xxl-12 col-md-6">
            <div className="card h-100">
                <div className="card-header border-bottom d-flex align-items-center flex-wrap gap-2 justify-content-between">
                    <h6 className="fw-bold text-lg mb-0">Sales Statistics</h6>
                    <Link
                        to="/reports"
                        className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                    >
                        View All
                        <Icon
                            icon="solar:alt-arrow-right-linear"
                            className="icon"
                        />
                    </Link>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center gap-1 justify-content-between mb-44">
                        <div>
                            {/* Total Projects Count */}
                            <h5 className="fw-semibold mb-12">{projects.length}</h5>
                            <span className="text-secondary-light fw-normal text-xl">
                                Total Projects
                            </span>
                        </div>

                        {/* Small Sparkline Chart */}
                        <ReactApexChart 
                            options={chartOptions} 
                            series={chartSeries} 
                            type="area" 
                            height={80} 
                            width={164} 
                        />
                    </div>

                    <div className="d-flex align-items-center gap-1 justify-content-between">
                        <div>
                            {/* REAL Total Collected Amount */}
                            <h5 className="fw-semibold mb-12">
                                ₹{totalCollected.toLocaleString('en-IN')}
                            </h5>
                            <span className="text-secondary-light fw-normal text-xl">
                                Total Collected Revenue
                            </span>
                        </div>

                        <div id="areaChart">
                           <Icon icon="solar:chart-square-bold" className="text-primary-600" width="40" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatisticsOne