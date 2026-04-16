import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useSelector } from "react-redux";

const UnitCountOne = () => {
    // Defaulting to empty arrays ensures .length and .reduce don't crash on initial load
    const { customers = [] } = useSelector((state) => state.customers);
    const { projects = [] } = useSelector((state) => state.projects);
    const { payments = [] } = useSelector((state) => state.payments);

    // 1. Count Completed Projects
    const completedProjectsCount = useMemo(() => {
        return projects.filter(project => project.status === "Completed").length;
    }, [projects]);

    // 2. Calculate Total Project Revenue
    const totalAmount = useMemo(() => {
        return projects.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
    }, [projects]);

    // 3. Calculate Total Collected (Fixed the dependency array syntax here)
    const paidAmount = useMemo(() => {
        return payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    }, [payments]);

    // 4. Calculate Pending Balance
    const totalPendingPayments = useMemo(() => {
        return totalAmount - paidAmount;
    }, [totalAmount, paidAmount]);

    // Reusable formatter for Currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
            {/* Total Customers */}
            <StatCard 
                title="Total Customers" 
                value={customers.length} 
                icon="gridicons:multiple-users" 
                colorClass="bg-cyan" 
                bgClass="bg-gradient-start-1" 
            />

            {/* Total Projects */}
            <StatCard 
                title="Total Projects" 
                value={projects.length} 
                icon="fa-solid:award" 
                colorClass="bg-purple" 
                bgClass="bg-gradient-start-2" 
            />

            {/* Completed Projects */}
            <StatCard 
                title="Completed Projects" 
                value={completedProjectsCount} 
                icon="solar:check-read-linear" 
                colorClass="bg-success-main" 
                bgClass="bg-gradient-start-4" 
            />

            {/* Total Amount */}
            <StatCard 
                title="Total Amount" 
                value={formatCurrency(totalAmount)} 
                icon="solar:wallet-bold" 
                colorClass="bg-info-main" 
                bgClass="bg-gradient-start-3" 
            />

            {/* Total Collected */}
            <StatCard 
                title="Total Collected" 
                value={formatCurrency(paidAmount)} 
                icon="solar:cash-out-bold" 
                colorClass="bg-success-main" 
                bgClass="bg-gradient-start-4" 
            />

            {/* Pending Payments */}
            <StatCard 
                title="Pending Payments" 
                value={formatCurrency(totalPendingPayments)} 
                icon="fa6-solid:file-invoice-dollar" 
                colorClass="bg-red" 
                bgClass="bg-gradient-start-5" 
            />
        </div>
    );
};

const StatCard = ({ title, value, icon, colorClass, bgClass }) => (
    <div className="col">
        <div className={`card shadow-none border ${bgClass} h-100`}>
            <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div>
                        <p className="fw-medium text-primary-light mb-1">{title}</p>
                        <h6 className="mb-0">{value}</h6>
                    </div>
                    <div className={`w-50-px h-50-px ${colorClass} rounded-circle d-flex justify-content-center align-items-center`}>
                        <Icon icon={icon} className="text-white text-2xl mb-0" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default UnitCountOne;