import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import HasPermission from "../components/HasPermission";
import { usePaymentReminders } from "../hook/usePaymentReminders";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const MasterLayout = ({ children }) => {
  const { overdue, unpaidCompleted, totalCount } = usePaymentReminders();
  const {user} = useSelector((state) => state.auth)

  const [prevCount,setPrevCount] = useState(totalCount)
  const[showAlert,setShowAlert] = useState(false)

useEffect(()=>{
  if(totalCount > prevCount){
    setShowAlert(true);

    const timer = setTimeout(() => setShowAlert(false),5000)
    return () => clearTimeout(timer)
  }
  setPrevCount(totalCount)
},[totalCount,prevCount])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(amount);
  };

  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation(); // Hook to get the current route

  useEffect(() => {
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };


  // Customer Route Active list

const isCustomerRoute =
  location.pathname.startsWith("/customers-list") ||
  location.pathname.startsWith("/add-customer") ||
  location.pathname.startsWith("/edit-customer");

const isStaffRoute =
  location.pathname.startsWith("/staff-list") ||
  location.pathname.startsWith("/add-staff") ||
  location.pathname.startsWith("/edit-staff");

// ADDED: Project route check
const isProjectRoute =
  location.pathname.startsWith("/projects-list") ||
  location.pathname.startsWith("/add-projects") ||
  location.pathname.startsWith("/projects/"); // This covers single project views

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () =>{
    dispatch(logout())
    navigate("/sign-in")
  }
  
  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type='button'
          className='sidebar-close-btn'
        >
          <Icon icon='radix-icons:cross-2' />
        </button>
        <div className="d-flex align-items-center justify-content-center">
          <Link to='/' className='sidebar-logo'>
            <img
              src='/assets/images/logo.png'
              alt='site logo'
              className='light-logo'
            />
            <img
              src='/assets/images/logo.png'
              alt='site logo'
              className='dark-logo'
            />
            <img
              src='/assets/images/logo.png'
              alt='site logo'
              className='logo-icon'
            />
          </Link>
        </div>
        <div className='sidebar-menu-area'>
          <ul className='sidebar-menu' id='sidebar-menu'>

<HasPermission permission = {["view-dashboard","view-admin"]} mode = "any">
            <li>
              <NavLink to='/'
              className={`${(navData) => (navData.isActive ? "active-page" : "")} d-flex align-items-center gap-2 `} >
                <Icon
                  icon='solar:home-smile-angle-outline'
                  className='menu-icon'
                />
                <span>Dashboard</span>
              </NavLink>
            </li>
</HasPermission>

{/* Customers */}

<HasPermission permission={["view-customers", "create-customer"]} mode="any">
  <li className={`dropdown ${isCustomerRoute ? "open" : ""} mt-3`}>
    <NavLink 
      to="/customers-list" 
      className={`d-flex align-items-center ${isCustomerRoute ? "active" : ""}`}
    >
      <Icon icon="flowbite:users-group-outline" className="menu-icon" />
      <span>Customers</span>
    </NavLink>

    <ul
      className="sidebar-submenu"
      style={{
        maxHeight: isCustomerRoute ? "500px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}
    >
      <HasPermission permission={"create-customer"}>
        <li>
          <NavLink
            to="/add-customer"
            className={({ isActive }) => (isActive ? "active-page" : "")}
          >
            <i className="ri-circle-fill circle-icon text-info-main w-auto" />
            Add Customer
          </NavLink>
        </li>
      </HasPermission>

      <HasPermission permission={"view-customers"}>
        <li>
          <NavLink
            to="/customers-list"
            className={({ isActive }) => (isActive ? "active-page" : "")}
          >
            <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
            Customer List
          </NavLink>
        </li>
      </HasPermission>
    </ul>
  </li>
</HasPermission>

{/* Stafffs or Users */}

<HasPermission permission={["view-staffs","create-staff"]} mode = "any">
  
<li className={`dropdown ${isStaffRoute ? "open" : ""}`}>
  <NavLink to="/staff-list" className="d-flex align-items-center">
   <Icon icon="flowbite:user-circle-outline" className="menu-icon" />
    <span>Staffs</span>
  </NavLink>

  <ul
    className="sidebar-submenu"
    style={{
      maxHeight: isStaffRoute ? "500px" : "0px",
      overflow: "hidden",
      transition: "max-height 0.3s ease",
    }}
  >

    <HasPermission permission = {"create-staff"}>
        <li>
      <NavLink
        to="/add-staff"
        className={({ isActive }) =>
          isActive ? "active-page" : ""
        }
      >
        <i className="ri-circle-fill circle-icon text-info-main w-auto" />
        Add Staff
      </NavLink>


      
        </li>
      </HasPermission>
      <HasPermission permission = {"view-staffs"}>
    <li>
      <NavLink
        to="/staff-list"
        className={({ isActive }) =>
          isActive ? "active-page" : ""
        }
      >
        <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
        Staffs List
      </NavLink>
    </li>
</HasPermission>

  </ul>
</li>

</HasPermission>


{/* Projects Dropdown */}
<HasPermission permission={["view-projects", "create-projects"]} mode="any">
  <li className={`dropdown ${isProjectRoute ? "open" : ""}`}>
    <NavLink 
      to="/projects-list" 
      className={`d-flex align-items-center ${isProjectRoute ? "active" : ""}`}
    >
      <Icon icon='solar:folder-with-files-outline' className='menu-icon' />
      <span>Projects</span>
    </NavLink>
    
    <ul 
      className='sidebar-submenu'
      style={{
        maxHeight: isProjectRoute ? "500px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}
    >
      <HasPermission permission={"create-projects"}>
        <li>
          <NavLink
            to='/add-projects'
            className={({ isActive }) => (isActive ? "active-page" : "")}
          >
            <i className='ri-circle-fill circle-icon text-info-main w-auto' />
            Add Project
          </NavLink>
        </li>
      </HasPermission>

      <HasPermission permission={"view-projects"}>
        <li>
          <NavLink
            to='/projects-list'
            className={({ isActive }) => (isActive ? "active-page" : "")}
          >
            <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
            Project List
          </NavLink>
        </li>
      </HasPermission>
    </ul>
  </li>
</HasPermission>


<HasPermission permission = {"manage-access"} mode = "any">
            <li>
              <NavLink to='/role-access'
              className={(navData) => (navData.isActive ? "active-page" : "")}>
                <Icon
                  icon='solar:home-smile-angle-outline'
                  className='menu-icon'
                />
                <span>Role &amp; Access</span>
              </NavLink>
            </li>
</HasPermission>


            {/* Remainders and notifications */}

            <HasPermission permission = {"manage-remainders"}>
              
             <li className="mt-3">
              <NavLink
                to='/remainders'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='solar:bell-bing-outline' className='menu-icon' />
                <span>Notifications</span>
              </NavLink>
            </li>
            
            </HasPermission>


            <HasPermission permission = {"view-reports"}>

             <li className="mt-3">
              <NavLink
                to='/reports'
                className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                <Icon icon='solar:chart-square-outline' className='menu-icon' />
                <span>Reports</span>
              </NavLink>
            </li>
                </HasPermission>
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className='navbar-header'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-4'>
                <button
                  type='button'
                  className='sidebar-toggle'
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon='iconoir:arrow-right'
                      className='icon text-2xl non-active'
                    />
                  ) : (
                    <Icon
                      icon='heroicons:bars-3-solid'
                      className='icon text-2xl non-active '
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type='button'
                  className='sidebar-mobile-toggle'
                >
                  <Icon icon='heroicons:bars-3-solid' className='icon' />
                </button>
                {/* <form className='navbar-search'>
                  <input type='text' name='search' placeholder='Search' />
                  <Icon icon='ion:search-outline' className='icon' />
                </form> */}
              </div>
            </div>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-3'>
                
                {/* <ThemeToggleButton /> */}
               

                {/* Message dropdown end */}
               <div className='dropdown'>
      <button
        className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
        type='button'
        data-bs-toggle='dropdown'
      >
        <Icon icon='iconoir:bell' className='text-primary-light text-xl' />
        {totalCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
            {totalCount}
          </span>
        )}
      </button>
      
      <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
        <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
          <h6 className='text-lg text-primary-light fw-semibold mb-0'>Notifications</h6>
          <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
            {totalCount.toString().padStart(2, '0')}
          </span>
        </div>

        <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
          {/* Overdue Reminders */}
          {overdue.map((item, index) => (
                        <Link key={`overdue-${index}`} to={`/projects/${item.projectId}`} className="px-24 py-12 d-flex align-items-start gap-3 hover-bg-neutral-50">
                          <span className="w-44-px h-44-px bg-danger-subtle text-danger-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <Icon icon="solar:danger-bold" />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-0">Overdue</h6>
                            <p className="mb-0 text-sm text-secondary-light">{item.projectName}</p>
                            <p className="mb-0 text-xs fw-bold text-danger-main">{formatCurrency(item.balance)}</p>
                          </div>
                        </Link>
                      ))}
                      {unpaidCompleted.map((item, index) => (
                        <Link key={`unpaid-${index}`} to={`/projects/${item.projectId}`} className="px-24 py-12 d-flex align-items-start gap-3 hover-bg-neutral-50">
                          <span className="w-44-px h-44-px bg-warning-subtle text-warning-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <Icon icon="solar:check-read-bold" />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-0">Payment Pending</h6>
                            <p className="mb-0 text-sm text-secondary-light">{item.projectName}</p>
                            <p className="mb-0 text-xs fw-bold text-warning-main">{formatCurrency(item.balance)}</p>
                          </div>
                        </Link>
                      ))}
          {totalCount === 0 && (
            <div className="p-24 text-center text-secondary-light">No new payment alerts.</div>
          )}
        </div>
        
        <div className='text-center py-12 px-16'>
          <Link to='/remainders' className='text-primary-600 fw-semibold text-md'>
            View All
          </Link>
        </div>
      </div>
    </div>
                {/* Notification dropdown end */}
                <div className='dropdown'>
                  <button
                    className='d-flex justify-content-center align-items-center rounded-circle'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <Icon icon="solar:user-circle-bold"  className='w-40-px h-40-px object-fit-cover rounded-circle'/>
                     
                  
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                          {user.name}
                        </h6>
                        <span className='text-secondary-light fw-medium text-sm'>
                          {user.role}
                        </span>
                      </div>
                      <button type='button' className='hover-text-danger'>
                        <Icon
                          icon='radix-icons:cross-1'
                          className='icon text-xl'
                        />
                      </button>
                    </div>
                    <ul className='to-top-list'>
                      {/* <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/view-profile'
                        >
                          <Icon
                            icon='solar:user-linear'
                            className='icon text-xl'
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/company'
                        >
                          <Icon
                            icon='icon-park-outline:setting-two'
                            className='icon text-xl'
                          />
                          Setting
                        </Link>
                      </li> */}
                      <li>
                        <button onClick={() =>{handleLogout()}}
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3'
                        >
                          <Icon icon='lucide:power' className='icon text-xl' />{" "}
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className='dashboard-main-body' style = {{backgroundImage: "url('/assets/images/bg/bg_2.webp')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor : "none",
    minHeight: '100vh'}}>{children}</div>

        {/* Footer section */}
        <footer className='d-footer'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <p className='mb-0'>© 2026 Infinus Tech. All Rights Reserved.</p>
            </div>
            <div className='col-auto'>
              <p className='mb-0'>
                Made by <a href="https://saitechnosolutions.com/" rel="noreferrer" target="_blanck" className='text-primary-600'>Sai Techno Solutions</a>
              </p>
            </div>
          </div>
        </footer>
        {/* Floating Alert Toast */}
{showAlert && (
  <div 
    className="position-fixed bottom-0 end-0 m-24 z-3" 
    style={{ maxWidth: '350px', animation: 'slideIn 0.3s ease-out' }}
  >
    <div className="bg-white radius-12 shadow-lg border-start border-4 border-danger-main p-16 d-flex align-items-center gap-3">
      <div className="bg-danger-100 w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
        <Icon icon="solar:bell-bing-bold" className="text-danger-main text-xl" />
      </div>
      <div className="flex-grow-1">
        <h6 className="text-sm mb-0">New Payment Reminder!</h6>
        <p className="text-xs text-secondary-light mb-0">Check the notification bell for details.</p>
      </div>
      <button 
        onClick={() => setShowAlert(false)} 
        className="text-secondary-light hover-text-danger"
      >
        <Icon icon="line-md:close" />
      </button>
    </div>
  </div>
)}
      </main>
    </section>
  );
};

export default MasterLayout;
