import { Icon } from '@iconify/react';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { updateStaffFunction } from '../features/staff/staffService';
import { assignStaffToProjectFunction } from '../features/projects/projectService';

const EditStaffLayer = () => {
    const { id } = useParams(); // This is our staffId
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux Data
    const staffList = useSelector((state) => state.staffs.staffs);
    const projectList = useSelector((state) => state.projects.projects) || [];

    const staffMember = useMemo(() => 
        staffList.find((s) => String(s.id) === String(id)), 
    [staffList, id]);

    // Form State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState(""); 
    const [status, setStatus] = useState("Active");
    const [selectedProjectIds, setSelectedProjectIds] = useState([]); 
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (staffMember) {
            setName(staffMember.name || "");
            setPhone(staffMember.phone || "");
            setLocation(staffMember.location || "");
            setStatus(staffMember.status || "Active");
            setSelectedProjectIds(staffMember.projects || []);
        }
    }, [staffMember]);

    const filteredProjects = projectList.filter(proj => 
        proj.projectName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !selectedProjectIds.includes(proj.id)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            id,
            name,
            phone,
            location,
            status,
            projects: selectedProjectIds 
        };

        // 1. Correct Call: Call function directly, pass dispatch as argument
        const success = await updateStaffFunction(dispatch, id, payload);

        if (success) {
        await Promise.all(selectedProjectIds.map(projId => 
            assignStaffToProjectFunction(dispatch, projId, id, name)
        ));
            navigate(-1);
        }
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-8 col-lg-10">
                        <div className="card border">
                            <div className="card-body">
                                <h6 className="text-lg text-center text-primary-light mb-16">Edit Staff Member</h6>
                                <form onSubmit={handleSubmit}>
                                    
                                    <div className="mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Full Name *</label>
                                        <input type="text" className="form-control radius-8" required value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">Phone Number</label>
                                            <input type="text" className="form-control radius-8" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                        </div>
                                        <div className="col-md-6 mb-20">
                                            <label className="form-label fw-semibold text-primary-light text-sm mb-8">Base Location</label>
                                            <input type="text" className="form-control radius-8" value={location} onChange={(e) => setLocation(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="mb-20 position-relative">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Assigned Projects</label>
                                        <div className="d-flex flex-wrap gap-2 mb-10">
                                            {selectedProjectIds.map(projId => {
                                                const proj = projectList.find(p => p.id === projId);
                                                return proj ? (
                                                    <span key={projId} className="badge px-12 py-8 radius-8 d-flex align-items-center gap-2" style={{ backgroundColor: 'rgba(234, 139, 12, 0.1)', color: '#EA8B0C' }}>
                                                        {proj.projectName}
                                                        <Icon icon="ic:round-close" className="cursor-pointer" onClick={() => setSelectedProjectIds(selectedProjectIds.filter(i => i !== projId))} />
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>

                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            placeholder="Search projects..."
                                            value={searchTerm}
                                            onFocus={() => setIsDropdownOpen(true)}
                                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />

                                        {isDropdownOpen && (
                                            <ul className="position-absolute w-100 mt-1 bg-white radius-8 shadow-lg z-3 overflow-auto" style={{ maxHeight: '200px', listStyle: 'none', padding: 0, border: "1px solid #ddd" }}>
                                                {filteredProjects.map((proj) => (
                                                    <li key={proj.id} className="p-10 border-bottom cursor-pointer d-flex justify-content-between align-items-center" onMouseDown={() => { setSelectedProjectIds([...selectedProjectIds, proj.id]); setSearchTerm(""); }}>
                                                        <span>{proj.projectName}</span>
                                                        <Icon icon="ic:baseline-plus" style={{ color: '#EA8B0C' }} />
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-32">
                                        <button type='button' onClick={() => navigate(-1)} className="btn border-danger text-danger px-40">Cancel</button>
                                        <button type="submit" className="btn btn-primary px-40" style={{ backgroundColor: '#EA8B0C', border: 'none' }}>Save Details</button>
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

export default EditStaffLayer;