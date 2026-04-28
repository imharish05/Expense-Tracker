import React, { useEffect, useRef, useState, useMemo } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import api from ".././api/axios.js"

const MasterLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux Selectors
  const { user } = useSelector((state) => state.auth);
  
  // Local State & Refs
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [sidebarActive, seSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Fetch all data once on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setInitialLoading(true);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchAllData();
  }, []);


  // Sidebar dropdown logic & Mobile Menu Auto-Close
  useEffect(() => {
    // --- FIX: Close mobile menu whenever the route changes ---
    setMobileMenu(false);

    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");
      if (!clickedDropdown) return;
      const isActive = clickedDropdown.classList.contains("open");
      document.querySelectorAll(".sidebar-menu .dropdown").forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) submenu.style.maxHeight = "0px";
      });
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) submenu.style.maxHeight = `${submenu.scrollHeight}px`;
      }
    };
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );
    dropdownTriggers.forEach((trigger) =>
      trigger.addEventListener("click", handleDropdownClick)
    );
    return () => {
      dropdownTriggers.forEach((trigger) =>
        trigger.removeEventListener("click", handleDropdownClick)
      );
    };
  }, [location.pathname]); // This dependency ensures the effect runs on every page change

  const sidebarControl = () => seSidebarActive(!sidebarActive);
  const mobileMenuControl = () => setMobileMenu(!mobileMenu);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/sign-in");
  };

  // Route active checks
  const isWalletRoute =
    location.pathname.startsWith("/balance-list") ||
    location.pathname.startsWith("/add-balance") ||
    location.pathname.startsWith("/edit-balance");


  return (
    <section className={mobileMenu ? "overlay active" : "overlay"}>
      {/* ── Sidebar ── */}
      <aside
        className={
          sidebarActive
            ? "sidebar active"
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button onClick={mobileMenuControl} type="button" className="sidebar-close-btn">
          <Icon icon="radix-icons:cross-2" />
        </button>
        <div className="d-flex align-items-center justify-content-center">
          <Link to="/" className="sidebar-logo">
            <img src="/assets/images/logo.png" alt="site logo" className="light-logo" />
            <img src="/assets/images/logo.png" alt="site logo" className="dark-logo" />
            <img src="/assets/images/logo.png" alt="site logo" className="logo-icon" />
          </Link>
        </div>
        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
  {/* --- Overview Section --- */}
  <li className="sidebar-menu-header" style={{ fontSize: '10px', color: '#94a3b8', padding: '10px 20px', textTransform: 'uppercase', fontWeight: 700 }}>
    Analytics
  </li>
  <li>
    <NavLink
      to="/"
      className={({ isActive }) =>
        `${isActive ? "active-page" : ""} d-flex align-items-center gap-2`
      }
    >
      <Icon icon="solar:widget-bolt-bold-duotone" className="menu-icon" />
      <span>Command Center</span>
    </NavLink>
  </li>

  {/* --- Treasury / Wallet Section --- */}
  <li className="sidebar-menu-header" style={{ fontSize: '10px', color: '#94a3b8', padding: '20px 20px 10px', textTransform: 'uppercase', fontWeight: 700 }}>
    Finance
  </li>
  <li className={`dropdown ${isWalletRoute ? "open" : ""}`}>
    <NavLink
      to="#"
      className={`d-flex align-items-center ${isWalletRoute ? "active" : ""}`}
    >
      <Icon icon="solar:wallet-money-bold-duotone" className="menu-icon" />
      <span>Treasury</span>
    </NavLink>
    <ul
      className="sidebar-submenu"
      style={{
        maxHeight: isWalletRoute ? "500px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}
    >
      <li>
        <NavLink
          to="/add-balance"
          className={({ isActive }) => (isActive ? "active-page" : "")}
        >
          <i className="ri-add-circle-fill circle-icon text-success-main w-auto" /> 
          Top Up Balance
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/balance-list"
          className={({ isActive }) => (isActive ? "active-page" : "")}
        >
          <i className="ri-exchange-funds-fill circle-icon text-primary-600 w-auto" /> 
          Transaction Logs
        </NavLink>
      </li>
    </ul>
  </li>

  {/* --- Operational Sections --- */}
  <li>
    <NavLink
      to="/reports"
      className={({ isActive }) => (isActive ? "active-page" : "")}
    >
      <Icon icon="solar:document-list-bold-duotone" className="menu-icon" />
      <span>Financial Reports</span>
    </NavLink>
  </li>

</ul>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={sidebarActive ? "dashboard-main active" : "dashboard-main"}>
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button type="button" className="sidebar-toggle" onClick={sidebarControl}>
                  <Icon
                    icon={sidebarActive ? "iconoir:arrow-right" : "heroicons:bars-3-solid"}
                    className="icon text-2xl"
                  />
                </button>
                <button onClick={mobileMenuControl} type="button" className="sidebar-mobile-toggle">
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                {/* ── PROFILE DROPDOWN ── */}
                <div className="dropdown">
                  <button
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <Icon
                      icon="solar:user-circle-bold"
                      className="w-40-px h-40-px object-fit-cover rounded-circle text-primary-light"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-sm">
                    <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-2 text-capitalize">
                          {user?.name}
                        </h6>
                        <span className="text-secondary-light fw-medium text-sm text-capitalize">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                    <ul className="to-top-list">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3"
                        >
                          <Icon icon="lucide:power" className="icon text-xl" /> Log Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div
          className="dashboard-main-body"
          style={{
            backgroundAttachment: "fixed",
            backgroundImage: "url('/assets/images/bg/bg_2.webp')",
            backgroundSize: "cover",
            minHeight: "100vh",
          }}
        >
          {initialLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "60vh" }}
            >
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h6 className="mt-3 text-secondary-light">Initializing Dashboard...</h6>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>

        {/* Footer */}
        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            
            <div className="col-auto">
              <p className="mb-0">
                Made with 💖{" "}
                
                  By Harish
                
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;