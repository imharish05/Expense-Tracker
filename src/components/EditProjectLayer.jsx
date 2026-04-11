import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
// Assuming you have an update function in your service
import { updateProjectFunction } from '../features/projects/projectService';

const EditProjectLayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State
    const [projectName, setProjectName] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [location, setLocation] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [projectType, setProjectType] = useState("");
    const [cost, setCost] = useState("");
    const [status, setStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Get Data from Store
    const projectList = useSelector((state) => state.projects.projects);
    const customersList = useSelector((state) => state.customers.customers);
    
    const project = useMemo(() => 
        projectList.find((p) => p.id === id), 
    [projectList, id]);

    // 1. Populate fields when project is found
    useEffect(() => {
        if (project) {
            setProjectName(project.projectName || "");
            setCustomerId(project.customerId || "");
            setCustomerName(project.customerName || "");
            setSearchTerm(project.customerName || ""); // Set search term to current customer
            setLocation(project.location || "");
            setProjectType(project.projectType || "");
            setCost(project.cost || "");
            setStatus(project.status || "Initialized");
        }
    }, [project]);

    // Filter list for dropdown
    const filteredCustomers = customersList.filter(customer => {
        const name = customer?.name || "";
        const loc = customer?.location || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               loc.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleCancel = () => {
        navigate(-1);
    };

    const handleProjectUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id,
                projectName,
                location,
                customerName,
                customerId,
                cost,
                projectType,
                status
            };

            // Call update service instead of add
            updateProjectFunction(dispatch, id, payload);
            navigate(-1);
        } catch (err) {
            console.error("Update failed:", err.message);
        }
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-8 col-lg-10">
                        <div className="card border">
                            <div className="card-body">
                                <h6 className="text-lg text-center text-primary-light mb-16">Edit Project</h6>
                                <form onSubmit={handleProjectUpdate}>

                                    {/* SEARCHABLE CUSTOMER DROPDOWN */}
                                    <div className="mb-20 position-relative">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Select Customer <span className="text-danger-600">*</span>
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control radius-8"
                                                placeholder="Type name or location..."
                                                value={searchTerm}
                                                onFocus={() => setIsDropdownOpen(true)}
                                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setIsDropdownOpen(true);
                                                }}
                                            />
                                        </div>

                                        {isDropdownOpen && (
                                            <ul className="position-absolute w-100 mt-1 bg-white radius-8 shadow-lg z-3 overflow-auto" 
                                                style={{ maxHeight: '200px', listStyle: 'none', padding: 0, border: "1px solid #ddd" }}>
                                                {filteredCustomers.length > 0 ? (
                                                    filteredCustomers.map((customer) => (
                                                        <li 
                                                            key={customer.id}
                                                            className="p-10 border-bottom cursor-pointer hover-bg-primary-50"
                                                            onMouseDown={(e) => {
                                                                e.preventDefault(); 
                                                                setCustomerId(customer.id);
                                                                setCustomerName(customer.name);
                                                                setSearchTerm(customer.name);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                        >
                                                            <div className="fw-medium text-primary-light">{customer.name}</div>
                                                            <small className="text-gray-500">{customer.address}</small>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="p-10 text-center text-gray-400">No customers found</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Project Name */}
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Project Name *</label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            required
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Location</label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </div>

                                    {/* Project Type */}
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Project Type *</label>
                                        <select
                                            className="form-control radius-8 form-select"
                                            value={projectType}
                                            onChange={(e) => setProjectType(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Select the project type</option>
                                            <option value="Residential">Residential</option>
                                            <option value="Commercial">Commercial</option>
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Status *</label>
                                        <select
                                            className="form-control radius-8 form-select"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            required
                                        >
                                            <option value="Initialized">Initialized</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>

                                    {/* Cost */}
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Cost</label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            value={cost}
                                            onChange={(e) => setCost(e.target.value)}
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <button
                                            type='button'
                                            onClick={handleCancel}
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProjectLayer;