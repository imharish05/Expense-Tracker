import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

const LatestRegisteredOne = () => {
    // This data would typically come from your Redux store or a useEffect API call

    const customers = useSelector((state) => state.customers.customers) || [];

    // 2. Optionally slice the array if you only want the "latest" (e.g., top 5)
    const latestCustomers = customers.slice(0, 5);

const formatDate = (dateStr) => {
    // 1. Check if dateStr exists and is a string
    if (!dateStr || typeof dateStr !== 'string') {
        return "N/A"; 
    }

    // 2. Check if the string actually contains a '/' before splitting
    if (!dateStr.includes('/')) {
        // If your API sometimes sends ISO format (2024-05-01), handle it here
        const date = new Date(dateStr);
        return isNaN(date) ? "Invalid Date" : date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    try {
        const [day, month, year] = dateStr.split('/');
        return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (error) {
        return "Invalid Date";
    }
};

    return (
        <div className="col-xxl-9 col-xl-12">
            <div className="card h-100">
                <div className="card-body p-24">
                    <div className="d-flex flex-wrap align-items-center gap-1 justify-content-between mb-16">
                        <ul className="nav border-gradient-tab nav-pills mb-0" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link d-flex align-items-center active" id="pills-to-do-list-tab" data-bs-toggle="pill" data-bs-target="#pills-to-do-list" type="button" role="tab">
                                    Latest Registered
                                    <span className="text-sm fw-semibold py-6 px-12 bg-neutral-500 rounded-pill text-white line-height-1 ms-12 notification-alert">
                                        {latestCustomers.length}
                                    </span>
                                </button>
                            </li>
                        </ul>
                        <Link to="/customers-list" className="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                            View All
                            <Icon icon="solar:alt-arrow-right-linear" className="icon" />
                        </Link>
                    </div>

                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-to-do-list" role="tabpanel" tabIndex={0}>
                            <div className="table-responsive scroll-sm">
                                <table className="table bordered-table sm-table mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">Users</th>
                                            <th scope="col">Registered On</th>
                                            <th scope="col">Project Type</th>
                                            <th scope="col" className="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestCustomers.map((customer) => (
                                            <tr key={customer.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                
                                                        <div className="flex-grow-1">
                                                            <h6 className="text-md mb-0 fw-medium">{customer.name}</h6>
                                                            <span className="text-sm text-secondary-light fw-medium">{customer.phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{formatDate(customer.createdAt)}</td>
                                                <td>{customer.projectType}</td>
                                                <td className="text-center">
                                                    <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                                                        {customer.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LatestRegisteredOne