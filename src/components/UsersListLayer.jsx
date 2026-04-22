import React, { useState, useMemo, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { allCustomerFunction, deleteCustomerFunction } from "../features/customers/customerService";
import Swal from "sweetalert2";
import HasPermission from "./HasPermission";

const UsersListLayer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Get data and pagination metadata from Redux
  const { 
    customers: customerList, 
    totalPages: serverTotalPages 
  } = useSelector((state) => state.customers);

  // 2. Local State for Pagination & Filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // 3. Fetch data whenever Page or Limit changes


const hasMounted = useRef(false);

useEffect(() => {
    if (!hasMounted.current) {
        hasMounted.current = true;
        return;
    }
    allCustomerFunction(dispatch, currentPage, itemsPerPage);
}, [dispatch, currentPage, itemsPerPage]);

  // 4. Client-side Search/Filter 
  // (Note: For very large datasets, you'd move this to the backend too)
  const filteredUsers = useMemo(() => {
    return (customerList || []).filter((user) => {
      const name = user?.name || "";
      const address = user?.address || "";
      const phone = user?.phone || "";
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm);

      return matchesSearch;
    });
  }, [customerList, searchTerm, projectFilter]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-success-focus text-success-600 border border-success-main";
      case "Inactive":
        return "bg-neutral-200 text-neutral-600 border border-neutral-400";
      default:
        return "bg-neutral-200 text-neutral-600 border border-neutral-400";
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '<span style="font-size: 25px">Are You Sure?</span>',
      text: "This action is permanent. Deleting this customer will also remove all associated projects and stages.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea8b0c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCustomerFunction(dispatch, id);
      }
    });
  };

  const handleEdit = (id) => navigate(`/edit-customer/${id}`);

  return (
    <div className="card h-100 p-0 radius-12">
      {/* Header */}
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="text-md fw-medium text-secondary-light mb-0">Show</span>

          {/* Items Per Page Selector */}
          <select
            className="form-select form-select-sm w-auto ps-12 radius-12 h-40-px"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when limit changes
            }}
          >
            {[5, 10, 20, 50, 100].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>

          {/* Search Input */}
          <div className="navbar-search position-relative">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Icon icon="ion:search-outline" className="icon position-absolute end-0 me-12 top-50 translate-middle-y" />
          </div>
        </div>

        <HasPermission permission={"create-customer"}>
          <Link to="/add-customer" className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2">
            <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
            Add New User
          </Link>
        </HasPermission>
      </div>

      {/* Table Body */}
      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <HasPermission permission={["edit-customer", "delete-customer"]} mode="any">
                  <th className="text-center">Action</th>
                </HasPermission>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>
                      {/* Serial number calculation based on current page */}
                      {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, "0")}
                    </td>
                    <td className="text-capitalize">{user.name}</td>
                    <td className="text-capitalize">{user.phone}</td>
                    <td className="text-capitalize">{user.address}</td>
                    <td className="text-capitalize">
                      <span className={`${getStatusClass(user.status)} px-12 py-4 radius-4 fw-medium text-sm`}>
                        {user.status}
                      </span>
                    </td>
                    
                    <HasPermission permission={["edit-customer", "delete-customer"]} mode="any">
                      <td className="text-center">
                        <div className="d-flex align-items-center gap-10 justify-content-center">
                          <HasPermission permission={"edit-customer"}>
                            <button onClick={() => handleEdit(user.id)} className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle">
                              <Icon icon="lucide:edit" className="menu-icon" />
                            </button>
                          </HasPermission>

                          <HasPermission permission={"delete-customer"}>
                            <button onClick={() => handleDelete(user.id)} className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle">
                              <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                            </button>
                          </HasPermission>
                        </div>
                      </td>
                    </HasPermission>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {serverTotalPages > 1 && (
          <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
            <button
              className="btn btn-sm btn-light"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>

            {[...Array(serverTotalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-light"}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-sm btn-light"
              disabled={currentPage === serverTotalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersListLayer;