import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addStaffFunction } from '../features/staff/staffService';

const AddStaffLayer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get projects from Redux to populate the dropdown
    const projectList = useSelector((state) => state.projects.projects) || [];

    // Form State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Active");
    
    // Project Selection State
    const [selectedProjectIds, setSelectedProjectIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleCancel = () => {
        navigate(-1);
    };

    // Project Logic
    const filteredProjects = projectList.filter(proj => {
        const pName = proj?.projectName || "";
        return pName.toLowerCase().includes(searchTerm.toLowerCase()) && 
               !selectedProjectIds.includes(proj.id); 
    });

    const handleAddProject = (projId) => {
        setSelectedProjectIds([...selectedProjectIds, projId]);
        setSearchTerm("");
        setIsDropdownOpen(false);
    };

    const handleRemoveProject = (projId) => {
        setSelectedProjectIds(selectedProjectIds.filter(id => id !== projId));
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: crypto.randomUUID(),
                name,
                phone,
                location,
                status,
                projects: selectedProjectIds // 🏗️ Sending assigned projects
            };

            addStaffFunction(dispatch, payload);
            navigate(-1);
        } catch (err) {
            console.error("Error adding staff:", err.message);
        }
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-8 col-lg-10">
                        <div className="card border">
                            <div className="card-body">
                                <h6 className="text-lg text-center text-primary-light mb-16">Add New Staff Member</h6>
                                <form onSubmit={handleAddStaff}>
                                    
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Full Name *</label>
                                        <input type="text" className="form-control radius-8" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Full Name" />
                                    </div>

                                    

                                    <div className="row">
                                        <div className="col-md-6 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">Phone Number *</label>
                                            <input type="tel" className="form-control radius-8" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
                                        </div>
                                        <div className="col-md-6 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">Base Location</label>
                                            <input type="text" className="form-control radius-8" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Site Office" />
                                        </div>
                                    </div>

                                    {/* 🏗️ Project Selection Section */}
                                    <div className="mb-20 position-relative">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Assign to Projects</label>
                                        
                                        {/* Display Selected Project Badges */}
                                        <div className="d-flex flex-wrap gap-2 mb-10">
                                            {selectedProjectIds.map(projId => {
                                                const proj = projectList.find(p => p.id === projId);
                                                return proj ? (
 <div key={projId} className="d-flex align-items-start">
    <span 
        className="badge px-12 py-8 radius-8 d-flex align-items-center gap-3" 
        style={{ 
            backgroundColor: 'rgba(234, 139, 12, 0.1)', 
            color: '#EA8B0C', 
            border: '1px solid rgba(234, 139, 12, 0.2)' 
        }}
    >
        {/* Stacked Text Container */}
        <div className="d-flex flex-column align-items-center gap-2">
            <span className="fw-bold" style={{ lineHeight: '1.2' }}>
                {proj.projectName}
            </span>
            <span className="text-secondary-light" style={{ fontSize: '11px', opacity: 0.8 }}>
                <Icon icon="lucide:map-pin" className="me-1" />
                {proj.location}
            </span>
        </div>

        {/* Close Icon at the end */}
        <Icon 
            icon="ic:round-close" 
            className="cursor-pointer text-lg" 
            style={{ minWidth: '18px' }}
            onClick={() => handleRemoveProject(projId)} 
        />
    </span>
</div>
                                                ) : null;
                                            })}
                                        </div>

                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            placeholder="Search and select projects..."
                                            value={searchTerm}
                                            onFocus={() => setIsDropdownOpen(true)}
                                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />

                                        {isDropdownOpen && filteredProjects.length > 0 && (
                                            <ul className="position-absolute w-100 mt-1 bg-white radius-8 shadow-lg z-3 overflow-auto" 
                                                style={{ maxHeight: '160px', listStyle: 'none', padding: 0, border: "1px solid #ddd" }}>
                                                {filteredProjects.map((proj) => (
                                                    <li key={proj.id} className="p-10 border-bottom cursor-pointer hover-bg-primary-50" 
                                                        onMouseDown={() => handleAddProject(proj.id)}>
                                                            <div className='d-flex justify-content-between align-items-center'>
                                                        <span className="text-primary-light">{proj.projectName}</span>
                                                        <Icon icon="ic:baseline-plus" style={{ color: '#EA8B0C' }} />
                                                            </div>
                                                        <small>{proj.location}</small>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Status</label>
                                        <select className="form-control radius-8 form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-32">
                                        <button type='button' onClick={handleCancel} className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary text-md px-56 py-12 radius-8" style={{ backgroundColor: '#EA8B0C', borderColor: '#EA8B0C' }}>
                                            Save Staff
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

export default AddStaffLayer;