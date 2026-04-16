import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import useReactApexChart from '../../hook/useReactApexChart';

const SalesStatisticOne = () => {
    // 1. State for filter
    const [viewType, setViewType] = useState("Monthly");

    const stagesData = useSelector((state) => state.stages.stage) || [];

    // 2. Dynamic Data Processing
    const chartData = useMemo(() => {
        if (viewType === "Monthly") {
            const monthTotals = new Array(12).fill(0);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            stagesData.forEach(project => {
                project.stages?.forEach(stage => {
                    const date = new Date(stage.updatedAt || Date.now());
                    const monthIndex = date.getMonth(); 
                    monthTotals[monthIndex] += Number(stage.paid || 0);
                });
            });

            return { series: monthTotals, categories: monthNames };
        } else {
            // YEARLY LOGIC: Group by unique years found in data
            const yearMap = {};
            stagesData.forEach(project => {
                project.stages?.forEach(stage => {
                    const year = new Date(stage.updatedAt || Date.now()).getFullYear();
                    yearMap[year] = (yearMap[year] || 0) + Number(stage.paid || 0);
                });
            });

            // Sort years and prepare arrays
            const sortedYears = Object.keys(yearMap).sort();
            return {
                series: sortedYears.map(y => yearMap[y]),
                categories: sortedYears
            };
        }
    }, [stagesData, viewType]); // Re-run when viewType changes

    // 3. Pass results to hook
    const { chartOptions, chartSeries } = useReactApexChart(chartData.series, chartData.categories);

    const totalEarnings = chartData.series.reduce((a, b) => a + b, 0);

    return (
        <div className="col-xxl-11 col-xl-12">
            <div className="card h-100">
                <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                        <h6 className="text-lg mb-0">Payment Statistics</h6>
                        {/* 4. Added onChange handler */}
                        <select 
                            className="form-select bg-base form-select-sm w-auto" 
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value)}
                        >
                            <option value="Yearly">Yearly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                    
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
                        <h6 className="mb-0">
                            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(totalEarnings)}
                        </h6>
                        <span className="text-sm fw-semibold rounded-pill bg-success-focus text-success-main border br-success px-8 py-4 line-height-1 d-flex align-items-center gap-1">
                            Collected <Icon icon="bxs:up-arrow" className="text-xs" />
                        </span>
                        <span className="text-xs fw-medium">Total for {viewType} View</span>
                    </div>

                    <ReactApexChart 
                        options={chartOptions} 
                        series={chartSeries} 
                        type="area" 
                        height={264} 
                    />
                </div>
            </div>
        </div>
    );
};

export default SalesStatisticOne;