import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import MasterLayout from "../masterLayout/MasterLayout";

const ProtectedLayout = () => {
    const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!isInitialized && token) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated && !token) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    return <MasterLayout />;

};

export default ProtectedLayout;