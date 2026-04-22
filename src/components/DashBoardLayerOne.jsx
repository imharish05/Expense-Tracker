import React from 'react'
import SalesStatisticOne from './child/SalesStatisticOne';
import LatestRegisteredOne from './child/LatestRegisteredOne';
import UnitCountOne from './child/UnitCountOne';

const DashBoardLayerOne = () => {

    return (
        <>
            {/* UnitCountOne */}
            <UnitCountOne />

            <section className="row gy-4 mt-1">

                {/* SalesStatisticOne */}
                <SalesStatisticOne />

                {/* LatestRegisteredOne */}
                <LatestRegisteredOne />

            </section>
        </>


    )
}

export default DashBoardLayerOne