import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import useReactApexChart from '../../hook/useReactApexChart';

const SalesStatisticOne = () => {
    const [viewType, setViewType] = useState("Monthly");

    // Pull the dedicated allStages array and totalCollected from Redux
    const { allStages, totalCollected } = useSelector((state) => state.stages);

    const chartData = useMemo(() => {
        const monthTotals = new Array(12).fill(0);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (viewType === "Monthly") {
            // Logic for Monthly View
            if (Array.isArray(allStages)) {
                allStages.forEach(stage => {
                    const date = new Date(stage.updatedAt || stage.createdAt);
                    if (!isNaN(date)) {
                        const monthIndex = date.getMonth(); 
                        monthTotals[monthIndex] += Number(stage.paid || 0);
                    }
                });
            }
            return { series: monthTotals, categories: monthNames };
        } else {
            // Logic for Yearly View
            const yearMap = {};
            if (Array.isArray(allStages)) {
                allStages.forEach(stage => {
                    const year = new Date(stage.updatedAt || stage.createdAt).getFullYear();
                    if (!isNaN(year)) {
                        yearMap[year] = (yearMap[year] || 0) + Number(stage.paid || 0);
                    }
                });
            }
            const sortedYears = Object.keys(yearMap).sort();
            return { 
                series: sortedYears.map(y => yearMap[y]), 
                categories: sortedYears 
            };
        }
    }, [allStages, viewType]);

    // Hook integration
    const { chartOptions, chartSeries } = useReactApexChart(chartData.series, chartData.categories);

    return (
        <div className="col-xxl-11 col-xl-12">
            <div className="card h-100">
                <div className="card-body">
                    {/* Header with Dropdown */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between">
                        <h6 className="text-lg mb-0">Payment Statistics</h6>
                        <select 
                            className="form-select bg-base form-select-sm w-auto" 
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value)}
                        >
                            <option value="Yearly">Yearly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                    
                    {/* Total Display Section */}
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
                        <h6 className="mb-0">
                            {new Intl.NumberFormat("en-IN", { 
                                style: "currency", 
                                currency: "INR", 
                                maximumFractionDigits: 0 
                            }).format(totalCollected || 0)}
                        </h6>
                        <span className="text-sm fw-semibold rounded-pill bg-success-focus text-success-main border br-success px-8 py-4 line-height-1 d-flex align-items-center gap-1">
                            Collected <Icon icon="bxs:up-arrow" className="text-xs" />
                        </span>
                        <span className="text-xs fw-medium">Overall Revenue</span>
                    </div>

                    {/* Chart Section */}
                    <ReactApexChart 
                        key={`${viewType}-${allStages?.length}`} // Force re-render for UI consistency
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